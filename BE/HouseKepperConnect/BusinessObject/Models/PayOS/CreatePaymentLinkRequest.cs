namespace BusinessObject.Models.PayOS
{
    public record CreatePaymentLinkRequest(
    long transID,
    string description,
    int price,
    string buyerName,
    string buyerEmail,
    int expriedAt
);
}