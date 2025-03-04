namespace BusinessObject.Models
{
    public class Chat
    {
        public int ChatID { get; set; }
        public int FromAccountID { get; set; }
        public int ToAccountID { get; set; }
        public string Content { get; set; }
        public DateTime SendAt { get; set; }
        public virtual Account FromAccount { get; set; }
        public virtual Account ToAccount { get; set; }
    }
}