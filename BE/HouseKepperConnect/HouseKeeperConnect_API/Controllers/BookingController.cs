using AutoMapper;
using BusinessObject.DTO;
using BusinessObject.DTOs;
using BusinessObject.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services.Interface;

namespace HouseKeeperConnect_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookingController : ControllerBase
    {
        private readonly IBookingService _bookingService;
        private readonly IMapper _mapper;
        private string Message;

        public BookingController(IBookingService bookingService, IMapper mapper)
        {
            _bookingService = bookingService;
            _mapper = mapper;
        }

        [HttpGet("GetBookings")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<Booking>>> GetBookingsAsync()
        {
            var bookings = await _bookingService.GetAllBookingsAsync();
            if (bookings == null || !bookings.Any())
            {
                Message = "No records!";
                return NotFound(Message);
            }
            return Ok(bookings);
        }

        [HttpGet("GetBookingByID")]
        [Authorize]
        public async Task<ActionResult<Booking>> GetBookingByID([FromQuery] int id)
        {
            var booking = await _bookingService.GetBookingByIDAsync(id);
            if (booking == null)
            {
                Message = "No records!";
                return NotFound(Message);
            }
            return Ok(booking);
        }

        [HttpGet("GetBookingByHousekeeperID")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<Booking>>> GetBookingByHousekeeperID([FromQuery] int housekeeperId)
        {
            var bookings = await _bookingService.GetBookingsByHousekeeperIDAsync(housekeeperId);
            if (bookings == null || !bookings.Any())
            {
                Message = "No records!";
                return NotFound(Message);
            }
            return Ok(bookings);
        }

        [HttpPost("AddBooking")]
        [Authorize]
        public async Task<ActionResult> AddBooking([FromQuery] BookingCreateDTO bookingCreateDTO)
        {
            if (bookingCreateDTO == null)
            {
                return BadRequest("Invalid booking data.");
            }
            var booking = _mapper.Map<Booking>(bookingCreateDTO);
            await _bookingService.AddBookingAsync(booking);
            return Ok("Booking added successfully!");
        }

        [HttpPut("UpdateBooking")]
        [Authorize]
        public async Task<ActionResult> UpdateBooking([FromQuery] BookingUpdateDTO bookingUpdateDTO)
        {
            var booking = await _bookingService.GetBookingByIDAsync(bookingUpdateDTO.BookingID);
            if (booking == null)
            {
                Message = "No records!";
                return NotFound(Message);
            }

            _mapper.Map(bookingUpdateDTO, booking);
            await _bookingService.UpdateBookingAsync(booking);
            return Ok("Booking updated successfully!");
        }

        [HttpDelete("DeleteBooking")]
        [Authorize]
        public async Task<ActionResult> DeleteBooking([FromQuery] int id)
        {
            await _bookingService.DeleteBookingAsync(id);
            Message = "Booking deleted successfully!";
            return Ok(Message);
        }
    }
}