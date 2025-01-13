namespace API.Models
{
    public record CreatePaymentLinkRequest(
long orderId,
string description,
int price,
string buyerName,
string buyerEmail,
int expriedAt
);
}