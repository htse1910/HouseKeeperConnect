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
        Refund = 5,
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
        Denied = 3,
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
        PendingFamilyConfirmation = 8,
        HousekeeperQuitJob = 9
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
    public enum BookingSlotStatus
    {
        Active = 1,
        Canceled = 2
    }

    public enum WithdrawStatus
    {
        WaitingForOTP = 1,
        OTPVerify = 2,
        Success = 3,
        Failed = 4
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

    public enum SupportRequestStatus
    {
        Processing = 1,
        Completed = 2
    }

    public enum SupportRequestType
    {
        Account = 1,
        Job = 2,
        IDVerify = 3,
        Transaction = 4
    }

    public enum Bank
    {
        Vietcombank = 1,
        VietinBank = 2,
        Techcombank = 3,
        BIDV = 4,
        MBBank = 5,
        VPBank = 6,
        ACB = 7,
        TPBank = 8,
        VIB = 9,
        Agribank = 10,
    }
}