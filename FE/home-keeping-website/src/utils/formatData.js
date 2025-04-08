export const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
};

export const formatCurrency = (amount) => {
    if (amount == null) return "";
    return amount.toLocaleString("vi-VN") + " VNĐ";
};