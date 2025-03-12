import avatar from "../assets/images/avatar1.png";

export const housekeeperInfo = {
    name: "Như Lê",
    nickname: "Như Nhân Ái",
    gender: { key: "profile.gender", value: "Nữ" },
    age: 32,
    introduction: { 
        key: "profile.introduction", 
        value: "Tôi là người giúp việc có 5 năm kinh nghiệm, chuyên về dọn dẹp nhà cửa và chăm sóc trẻ em. Tôi làm việc tận tâm, chu đáo và có trách nhiệm." },
    isVerified: true,
    rating: 4.5,
    avatar: avatar,
    workArea: "Quận 1, Thành phố Hồ Chí Minh",
    jobCompleted: 20,
    jobsApplied: 35,
    bankAccountNumber: "0123456789 - Vietcombank",
    transportation: { key: "profile.transportation", value: "Xe máy" }
};

export const skills = [
    { id: 1, key: "skills.cleaning", value: "Dọn dẹp nhà cửa" },
    { id: 2, key: "skills.cooking", value: "Nấu ăn" },
    { id: 3, key: "skills.laundry", value: "Giặt ủi" },
    { id: 4, key: "skills.child_care", value: "Chăm sóc trẻ em" },
    { id: 5, key: "skills.pet_care", value: "Chăm sóc thú cưng" }
];

export const schedule = [
    { title: "Nấu ăn", time: ["2025-03-11", "08:00 - 12:00"], status: { key: "schedule.status_pending", value: "Chưa xác nhận" } },
    { title: "Dọn dẹp nhà cửa", time: ["2025-03-12", "13:00 - 18:00"], status: { key: "schedule.status_confirmed", value: "Đã xác nhận" } }
];

export const pricing = [
    { label: "Giá theo giờ", value: "100.000 VND/giờ" },
    { label: "Giá theo ngày", value: "700.000 VND/ngày" },
    { label: "Giá theo tuần", value: "4.500.000 VND/tuần" }
];

export const documents = [
    { title: "profile.documents", value: "Chứng chỉ nghiệp vụ giúp việc", type: "certificate" },
    { title: "profile.documents", value: "Giấy xác nhận lý lịch", type: "identity" },
    { title: "profile.documents", value: "Giấy chứng nhận tiêm chủng", type: "health" }
];

export const reviews = [
    { reviewer: "Trần Thị B", rating: 5, date: "2 ngày trước", comment: "Làm việc rất tốt và có trách nhiệm. Sẽ thuê lại!" },
    { reviewer: "Lê Văn C", rating: 4, date: "1 tuần trước", comment: "Dọn dẹp sạch sẽ, gọn gàng." },
    { reviewer: "Nguyễn Văn D", rating: 5, date: "3 tuần trước", comment: "Nấu ăn rất ngon, làm việc chuyên nghiệp." }
];

export const contact = [
    { label: "contact.phone", value: "0123-xxxx-xxx" },
    { label: "contact.email", value: "example@email.com" },
    { label: "contact.zalo", value: "NhưLê Housekeeper" },
    { label: "contact.facebook", value: "fb.com/NhuLeHousekeeper" }
];

export const jobs = [
    { title: "dashboard_jobs.clean_house", location: "Quận 7, TP.HCM", hours: 8, date: "20/03/2025", salary: "800K" },
    { title: "dashboard_jobs.clean_office", location: "Quận 1, TP.HCM", hours: 6, date: "21/03/2025", salary: "1.2M" }
];

export const statistics = [
    { label: "dashboard_stats.completed_jobs", value: 24 },
    { label: "dashboard_stats.rating", value: "4.8" },
    { label: "dashboard_stats.this_month_income", value: "12.5M đ" }
];

export const paymentDetails = [
    { label: "dashboard_payment.total_income", value: "45.6M đ" },
    { label: "dashboard_payment.pending", value: "2.4M đ" },
    { label: "dashboard_payment.withdrawable", value: "8.2M đ", highlight: true }
];
