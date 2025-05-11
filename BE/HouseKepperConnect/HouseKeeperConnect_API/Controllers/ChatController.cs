using BusinessObject.DTO;
using BusinessObject.Models;
using HouseKeeperConnect_API.CustomServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
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
        private string Message;

        public ChatController(IChatService chatService, IAccountService accountService, IHubContext<ChatHub> hubContext)
        {
            _chatService = chatService;
            _accountService = accountService;
            _hubContext = hubContext;
        }

        [HttpGet("GetChat")]
        [Authorize]
        public async Task<IActionResult> GetChats(int fromAccountId, int toAccountId)
        {
            var chats = await _chatService.GetChatsBetweenUsersAsync(fromAccountId, toAccountId);
            return Ok(chats);
        }
        
        [HttpGet("GetChatUsersByUser")]
        [Authorize]
        public async Task<IActionResult> GetChatUsersByUSer(int fromAccountId)
        {
            var chats = await _chatService.GetChatUsersByUserAsync(fromAccountId);
            List<int> uIds = new List<int>();
            uIds = chats.Select(t => t.ToAccountID).Distinct().ToList();
            
            return Ok(uIds);
        }

        [HttpPost("Send")]
        [Authorize]
        public async Task<ActionResult<ChatReturnDTO>> SendMessage([FromQuery] ChatDTO chatDto)
        {
            if (chatDto == null || chatDto.FromAccountId <= 0 || chatDto.ToAccountId <= 0 || string.IsNullOrWhiteSpace(chatDto.Message))
            {
                return BadRequest("Invalid chat message. Ensure all fields are provided.");
            }
            if (chatDto.FromAccountId == chatDto.ToAccountId)
            {
                return BadRequest("Cannot send message to yourself.");
            }
            var fromAccount = await _accountService.GetAccountByIDAsync(chatDto.FromAccountId);
            var toAccount = await _accountService.GetAccountByIDAsync(chatDto.ToAccountId);

            if (fromAccount == null || toAccount == null)
            {
                return BadRequest("One or both accounts do not exist.");
            }

            DateTime utcNow = DateTime.UtcNow;

            TimeZoneInfo vietnamTimeZone = TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time");

            DateTime currentVietnamTime = TimeZoneInfo.ConvertTimeFromUtc(utcNow, vietnamTimeZone);

            var chat = new Chat
            {
                FromAccountID = chatDto.FromAccountId,
                ToAccountID = chatDto.ToAccountId,
                Content = chatDto.Message,
                SendAt = currentVietnamTime,
            };

                await _chatService.ChatAsync(chat);

            Message = "Message sent successfully!";
            var display = new ChatReturnDTO();
            display.Content = chat.Content;
            display.FromAccountID = chat.FromAccountID;
            display.ToAccountID = chat.ToAccountID;
            display.SendAt = chat.SendAt;


            return Ok(display);
        }
    }
}