namespace BusinessObject.Models.Enum
{
    public enum AccountStatus
    {
        Active = 1,
        Inactive = 0,
        Pending = 2,
    }

    public enum WalletStatus
    {
        Active = 1,
        Inactive = 0,
    }

    public enum TransactionType
    {
        Deposit = 1,
        Withdrawal = 2,
        Payment = 3,
        Payout = 4,
    }

    public enum TransactionStatus
    {
        Pending = 1,
        Completed = 2,
        Expired = 3,
        Canceled = 4,
    }

    public enum VerificationStatus
    {
        Pending = 1,
        Verified = 2,
    }

    public enum JobStatus
    {
        Pending = 1,
        Verified = 2,
        Accepted = 3,
        Completed = 4,
        Expired = 5,
        Canceled = 6,
    }

    public enum ReportStatus
    {
        Pending = 1,
        Success = 2,
    }

    public enum BookingStatus
    {
        Pending = 1,
        Verified = 2,
        Accepted = 3,
        Completed = 4,
        Canceled = 5,
    }

    public enum WithdrawStatus
    {
        Pending = 1,
        Completed = 2,
        Failed = 3
    }
}