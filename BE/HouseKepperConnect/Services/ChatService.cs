using BusinessObject.Models;
using Repositories.Interface;
using Services.Interface;

namespace Services
{
    public class ChatService : IChatService
    {
        private readonly IChatRepository _chatRepository;

        public ChatService(IChatRepository chatRepository)
        {
            _chatRepository = chatRepository;
        }

        public async Task<List<Chat>> GetChatsBetweenUsersAsync(int fromAccountId, int toAccountId) => await _chatRepository.GetChatsBetweenUsersAsync(fromAccountId, toAccountId);

        public async Task ChatAsync(Chat chat) => await _chatRepository.ChatAsync(chat);

        public async Task<List<Chat>> GetChatUsersByUserAsync(int fromAccountId) => await _chatRepository.GetChatUsersByUserAsync(fromAccountId);
    }
}