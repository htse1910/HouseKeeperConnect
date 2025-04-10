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
        Denied =3,
    }

    public enum JobStatus
    {
        Pending = 1,
        Verified = 2,
        Accepted = 3,
        Completed = 4,
        Expired = 5,
        Canceled = 6,
        NotPermitted = 7,
        PendingFamilyConfirmation = 8
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
        PendingFamilyConfirmation = 6
    }

    public enum WithdrawStatus
    {
        Pending = 1,
        Completed = 2,
        Failed = 3
    }

    public enum DayOfWeek
    {
        Sunday = 0,
        Monday = 1,
        Tuesday = 2,
        Wednesday = 3,
        Thursday = 4,
        Friday = 5,
        Saturday = 6,
    }

    public enum JobType
    {
        FullTime = 1,
        PartTime = 2,
    }

    public enum Gender
    {
        Male = 1,
        Female = 2,
    }

    public enum WorkType
    {
        Fulltime = 1,
        PartTime = 2,
    }

    public enum ApplicationStatus
    {
        Pending = 1,
        Accepted = 2,
        Denied = 3
    }

    public enum PayoutStatus
    {
        Pending = 1,
        Completed = 2
    }
    
    public enum PaymentStatus
    {
        Pending = 1,
        Completed = 2
    }

}