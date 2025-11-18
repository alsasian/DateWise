import { Response } from 'express';
import pool from '../config/database';
import { AuthRequest, InterestStatus } from '../types';
import { config } from '../config';

// Get messages for a match
export const getMessages = async (req: AuthRequest, res: Response): Promise<void> => {
  const client = await pool.connect();

  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Not authenticated' });
      return;
    }

    const { matchId } = req.params;

    // Verify user is part of this match
    const matchCheck = await client.query(
      'SELECT * FROM matches WHERE id = $1 AND (user_a_id = $2 OR user_b_id = $2)',
      [matchId, req.user.id]
    );

    if (matchCheck.rows.length === 0) {
      res.status(403).json({ success: false, error: 'Not authorized' });
      return;
    }

    // Verify it's a mutual match
    const mutualCheck = await client.query(
      `SELECT COUNT(*) as count FROM interests
       WHERE match_id = $1 AND status = $2`,
      [matchId, InterestStatus.ACCEPTED]
    );

    if (parseInt(mutualCheck.rows[0].count) < 2) {
      res.status(403).json({ success: false, error: 'Not a mutual match yet' });
      return;
    }

    // Get messages
    const messagesResult = await client.query(
      `SELECT m.*, u.name as sender_name
       FROM messages m
       JOIN users u ON m.from_user_id = u.id
       WHERE m.match_id = $1
         AND m.expires_at > CURRENT_TIMESTAMP
       ORDER BY m.created_at ASC`,
      [matchId]
    );

    // Mark messages as read
    await client.query(
      `UPDATE messages
       SET is_read = true
       WHERE match_id = $1 AND from_user_id != $2`,
      [matchId, req.user.id]
    );

    res.json({
      success: true,
      data: messagesResult.rows,
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch messages',
    });
  } finally {
    client.release();
  }
};

// Send a message
export const sendMessage = async (req: AuthRequest, res: Response): Promise<void> => {
  const client = await pool.connect();

  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Not authenticated' });
      return;
    }

    const { matchId } = req.params;
    const { message } = req.body;

    // Validate message length
    if (!message || message.trim().length === 0) {
      res.status(400).json({ success: false, error: 'Message cannot be empty' });
      return;
    }

    if (message.length > config.messaging.maxMessageLength) {
      res.status(400).json({
        success: false,
        error: `Message exceeds ${config.messaging.maxMessageLength} characters`,
      });
      return;
    }

    // Verify user is part of this match
    const matchCheck = await client.query(
      'SELECT * FROM matches WHERE id = $1 AND (user_a_id = $2 OR user_b_id = $2)',
      [matchId, req.user.id]
    );

    if (matchCheck.rows.length === 0) {
      res.status(403).json({ success: false, error: 'Not authorized' });
      return;
    }

    // Verify it's a mutual match
    const mutualCheck = await client.query(
      `SELECT COUNT(*) as count FROM interests
       WHERE match_id = $1 AND status = $2`,
      [matchId, InterestStatus.ACCEPTED]
    );

    if (parseInt(mutualCheck.rows[0].count) < 2) {
      res.status(403).json({ success: false, error: 'Not a mutual match yet' });
      return;
    }

    // Calculate expiry date
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + config.messaging.messageExpiryDays);

    // Insert message
    const result = await client.query(
      `INSERT INTO messages (match_id, from_user_id, message_text, expires_at)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [matchId, req.user.id, message.trim(), expiresAt]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0],
      message: 'Message sent',
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send message',
    });
  } finally {
    client.release();
  }
};

// Get unread message count
export const getUnreadCount = async (req: AuthRequest, res: Response): Promise<void> => {
  const client = await pool.connect();

  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Not authenticated' });
      return;
    }

    const result = await client.query(
      `SELECT COUNT(*) as count
       FROM messages msg
       JOIN matches m ON msg.match_id = m.id
       WHERE (m.user_a_id = $1 OR m.user_b_id = $1)
         AND msg.from_user_id != $1
         AND msg.is_read = false
         AND msg.expires_at > CURRENT_TIMESTAMP`,
      [req.user.id]
    );

    res.json({
      success: true,
      data: {
        unreadCount: parseInt(result.rows[0].count) || 0,
      },
    });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch unread count',
    });
  } finally {
    client.release();
  }
};
