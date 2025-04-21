import mongoose from "mongoose";
import { Account } from "../models/accountModel.js";

export const transferFunds = async (req, res) => {
  const { toAccountId, amount } = req.body;
  const userId = req.userId;

  if (!toAccountId || !amount) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const fromUserAccount = await Account.findOne({ userId }).session(session);
    const toUserAccount = await Account.findOne({ userId: toAccountId }).session(session);

    if (!fromUserAccount || !toUserAccount) {
      await session.abortTransaction();
      return res.status(400).json({ success: false, message: "Invalid account details" });
    }

    if (fromUserAccount.balance < amount) {
      await session.abortTransaction();
      return res.status(400).json({ success: false, message: "Insufficient balance" });
    }

    fromUserAccount.balance -= amount;
    toUserAccount.balance += amount;

    fromUserAccount.transactions.push({
      amount,
      type: "debit",
      description: `Transferred to user ${toAccountId}`,
    });

    toUserAccount.transactions.push({
      amount,
      type: "credit",
      description: `Received from user ${userId}`,
    });

    await fromUserAccount.save({ session });
    await toUserAccount.save({ session });

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      success: true,
      message: "Transfer successful",
      fromUserBalance: fromUserAccount.balance,
      toUserBalance: toUserAccount.balance,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error in transferring the fund", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
