using BusinessObject.DTO;
using BusinessObject.Models;
using HouseKeeperConnect_API.CustomServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Services;
using Services.Interface;

namespace HouseKeeperConnect_API.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    public class ChatController : ControllerBase
    {
        private readonly IChatService _chatService;
        private readonly IAccountService _accountService;
        private readonly IHubContext<ChatHub> _hubContext;
 

        public ChatController(IChatService chatService,IAccountService accountService, IHubContext<ChatHub> hubContext)
        {
            _chatService = chatService;
            _accountService = accountService;
            _hubContext = hubContext;

        }

        [HttpGet("GetChat")]
        public async Task<IActionResult> GetChats(int fromAccountId, int toAccountId)
        {
            var chats = await _chatService.GetChatsBetweenUsersAsync(fromAccountId, toAccountId);
            return Ok(chats);
        }


        [HttpPost("send")]
        public async Task<IActionResult> SendMessage([FromQuery] ChatDTO chatDto)
        {
            // Kiểm tra dữ liệu đầu vào
            if (chatDto == null || chatDto.FromAccountId <= 0 || chatDto.ToAccountId <= 0 || string.IsNullOrWhiteSpace(chatDto.Message))
            {
                return BadRequest("Invalid chat message. Ensure all fields are provided.");
            }

            // Kiểm tra xem tài khoản có tồn tại trong database không
            var fromAccount = await _accountService.GetAccountByIDAsync(chatDto.FromAccountId);
            var toAccount = await _accountService.GetAccountByIDAsync(chatDto.ToAccountId);

            if (fromAccount == null || toAccount == null)
            {
                return BadRequest("One or both accounts do not exist.");
            }

            // Tạo đối tượng chat
            var chat = new Chat
            {
                FromAccountID = chatDto.FromAccountId,
                ToAccountID = chatDto.ToAccountId,
                Content = chatDto.Message,
                SendAt = DateTime.UtcNow
            };

            try
            {
                await _chatService.ChatAsync(chat);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }

            return Ok(new { message = "Message sent successfully!" });
        }
    }
}
