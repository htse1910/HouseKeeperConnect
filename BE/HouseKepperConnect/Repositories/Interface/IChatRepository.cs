using BusinessObject.Models;

namespace Repositories.Interface
{
    public interface IChatRepository
    {
        Task<List<Chat>> GetChatsBetweenUsersAsync(int fromAccountId, int toAccountId);
        Task<List<Chat>> GetChatUsersByUserAsync(int fromAccountId);

        Task ChatAsync(Chat chat);
    }
}