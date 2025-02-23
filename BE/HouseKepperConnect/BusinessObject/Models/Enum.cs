namespace BusinessObject.Models
{
    public enum AccountStatus
    {
        Active = 1,
        Inactive = 0,
        Suspended = 2,
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
}