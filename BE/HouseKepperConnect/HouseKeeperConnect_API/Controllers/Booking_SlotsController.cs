﻿using AutoMapper;
using BusinessObject.DTO;
using BusinessObject.Migrations;
using BusinessObject.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services.Interface;

namespace HouseKeeperConnect_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class Booking_SlotsController : ControllerBase
    {
        private readonly IBooking_SlotsService _bookingSlotsService;
        private readonly IHouseKeeperService _houseKeeperService;
        private readonly IMapper _mapper;
        private string Message;

        public Booking_SlotsController(IBooking_SlotsService bookingSlotsService, IMapper mapper
            , IHouseKeeperService houseKeeperService)
        {
            _bookingSlotsService = bookingSlotsService;
            _mapper = mapper;
            _houseKeeperService = houseKeeperService;
        }

        [HttpGet("Booking_SlotsList")]
        [Authorize(Policy = "Admin")]
        public async Task<ActionResult<IEnumerable<Booking_Slots>>> GetBooking_SlotsAsync()
        {
            var bookingSlots = await _bookingSlotsService.GetAllBooking_SlotsAsync();
            if (bookingSlots == null || !bookingSlots.Any())
            {
                Message = "No records!";
                return NotFound(Message);
            }
            return Ok(bookingSlots);
        }

        [HttpGet("GetBooking_SlotsByID")]
        [Authorize]
        public async Task<ActionResult<Booking_Slots>> GetBooking_SlotsByID([FromQuery] int id)
        {
            var bookingSlot = await _bookingSlotsService.GetBooking_SlotsByIDAsync(id);
            if (bookingSlot == null)
            {
                Message = "No records!";
                return NotFound(Message);
            }
            return Ok(bookingSlot);
        }

        [HttpPost("AddBooking_Slots")]
        [Authorize(Policy = "Admin")]
        public async Task<ActionResult> AddBooking_Slots([FromQuery] Booking_SlotsCreateDTO bookingSlotsCreateDTO)
        {
            if (bookingSlotsCreateDTO == null)
            {
                return BadRequest("Invalid booking slots data.");
            }
            var bookingSlot = _mapper.Map<Booking_Slots>(bookingSlotsCreateDTO);
            await _bookingSlotsService.AddBooking_SlotsAsync(bookingSlot);
            return Ok("Booking slots added successfully!");
        }

        [HttpDelete("DeleteBooking_Slots")]
        [Authorize(Policy = "Admin")]
        public async Task<ActionResult> DeleteBooking_Slots([FromQuery] int id)
        {
            await _bookingSlotsService.DeleteBooking_SlotsAsync(id);
            Message = "Booking slots deleted successfully!";
            return Ok(Message);
        }

        [HttpGet("AvailableSlots/{housekeeperId}")]
        public async Task<ActionResult<List<int>>> GetAvailableSlots(int housekeeperId, [FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
        {
            var availableSlots = await _bookingSlotsService.GetAvailableSlotsByHousekeeper(housekeeperId, startDate, endDate);
            return Ok(availableSlots);
        }

        [HttpGet("GetBookingSlotsByDateAndBookingID")]
        [Authorize]
        public async Task<ActionResult<List<Booking_Slots>>> GetBookingSlotsByDateAndBookingID([FromQuery] int bookingId, [FromQuery] DateTime date)
        {
            if (bookingId <= 0)
                return BadRequest("Invalid Booking ID.");

            var slots = await _bookingSlotsService.GetBookingSlotsByDateAndBookingIDAsync(bookingId, date);
            if (slots == null || !slots.Any())
                return NotFound("No booking slots found for the specified booking ID and date.");

            return Ok(slots);
        }
        [HttpGet("GetBookingSlotsForHousekeeperByWeekAsync")]
        [Authorize(Policy = "Housekeeper")]
        public async Task<ActionResult<List<ScheduleWeekDTO>>> GetBookingSlotsForHousekeeperByWeekAsync([FromQuery] int accountID, [FromQuery] DateTime dateInWeek)
        {
            var hk = await _houseKeeperService.GetHousekeeperByUserAsync(accountID);
            if(hk == null)
            {
                Message = "Không tìm thấy người giúp việc!";
                return NotFound(Message);
            }

            int diff = dateInWeek.DayOfWeek - DayOfWeek.Sunday;
            if (diff < 0) diff += 7;

            DateTime weekStart = dateInWeek.AddDays(-diff).Date;
            DateTime weekEnd = weekStart.AddDays(6).Date;

            var bookingSlots = await _bookingSlotsService.GetBookingSlotsForHousekeeperByWeekAsync(hk.HousekeeperID, weekStart, weekEnd);

            if (bookingSlots == null || !bookingSlots.Any())
                return NotFound("không tìm thấy Slot làm việc trong tuần này!");

            var display = new List<ScheduleWeekDTO>();
            foreach (var bookingSlot in bookingSlots)
            {
                var dis = new ScheduleWeekDTO();
                dis.BookingID = bookingSlot.BookingID;
                dis.Booking_SlotsId = bookingSlot.Booking_SlotsId;
                dis.JobName = bookingSlot.Booking.Job.JobName;
                dis.DayOfWeek = bookingSlot.DayOfWeek;
                dis.Date = bookingSlot.Date;
                dis.SlotID = bookingSlot.SlotID;
                dis.Status = bookingSlot.Status;
                dis.CheckInTime = bookingSlot.CheckInTime;
                dis.IsCheckedIn = bookingSlot.IsCheckedIn;
                dis.ConfirmedAt = bookingSlot.ConfirmedAt;
                dis.IsConfirmedByFamily = bookingSlot.IsConfirmedByFamily;

                display.Add(dis);
            }


            return Ok(display);
        }
    }
 }