﻿using AutoMapper;
using BusinessObject.DTO;
using BusinessObject.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services.Interface;

namespace HouseKeeperConnect_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RatingController : ControllerBase
    {
        private readonly IRatingService _ratingService;
        private readonly IHouseKeeperService _houseKeeperService;
        private readonly IFamilyProfileService _familyProfileService;
        private readonly INotificationService _notificationService;
        private readonly IMapper _mapper;
        private string Message;

        public RatingController(IRatingService ratingService, IHouseKeeperService houseKeeperService,
            IFamilyProfileService familyProfileService, INotificationService notificationService, IMapper mapper)
        {
            _ratingService = ratingService;
            _houseKeeperService = houseKeeperService;
            _familyProfileService = familyProfileService;
            _notificationService = notificationService;
            _mapper = mapper;
        }

        [HttpGet("RatingList")]
        [Authorize]
        public async Task<ActionResult<RatingDisplayDTO>> GetRatingList(int pageNumber, int pageSize)
        {
            var list = await _ratingService.GetAllRatingsAsync(pageNumber, pageSize);
            if (list == null)
            {
                Message = "No records!";
                return NotFound(Message);
            }

            var nL = _mapper.Map<List<RatingDisplayDTO>>(list);
            return Ok(list);
        }

        [HttpGet("GetRatingByID")]
        [Authorize]
        public async Task<ActionResult<Rating>> GetRatingByID(int id)
        {
            var ra = await _ratingService.GetRatingByIDAsync(id);
            if (ra == null)
            {
                Message = "No records!";
                return NotFound(Message);
            }

            return Ok(ra);
        }

        [HttpGet("GetRatingListByHK")]
        [Authorize]
        public async Task<ActionResult<List<RatingDisplayDTO>>> getRatingsByHK(int id, int pageNumber, int pageSize)
        {
            var hk = await _houseKeeperService.GetHousekeeperByUserAsync(id);
            if (hk == null)
            {
                Message = "No Housekeeper found!";
                return NotFound(Message);
            }

            var ri = await _ratingService.GetRatingsByHKAsync(hk.HousekeeperID, pageNumber, pageSize);
            if (ri == null)
            {
                Message = "No records!";
                return NotFound(Message);
            }

            var nRi = _mapper.Map<List<RatingDisplayDTO>>(ri);

            return Ok(nRi);
        }

        [HttpGet("GetRatingListByFA")]
        [Authorize(Policy = "Family")]
        public async Task<ActionResult<List<RatingDisplayDTO>>> getRatingsByFA(int id, int pageNumber, int pageSize)
        {
            var fa = await _familyProfileService.GetFamilyByAccountIDAsync(id);
            if (fa == null)
            {
                Message = "No family found!";
                return NotFound(Message);
            }

            var ri = await _ratingService.GetRatingsByFAAsync(fa.FamilyID, pageNumber, pageSize);
            if (ri == null)
            {
                Message = "No records!";
                return NotFound(Message);
            }

            var nRi = _mapper.Map<List<RatingDisplayDTO>>(ri);

            return Ok(nRi);
        }

        [HttpPost("AddRating")]
        [Authorize(Policy = "Family")]
        public async Task<ActionResult> Addrating([FromQuery] RatingCreateDTO ratingCreateDTO)
        {
            var hk = await _houseKeeperService.GetHousekeeperByUserAsync(ratingCreateDTO.Reviewee);
            if (hk == null)
            {
                Message = "No Housekeeper found!";
                return NotFound(Message);
            }

            var fa = await _familyProfileService.GetFamilyByAccountIDAsync(ratingCreateDTO.Reviewer);
            if (fa == null)
            {
                Message = "No family found!";
                return NotFound(Message);
            }

            var ra = new Rating();
            ra.FamilyID = fa.FamilyID;
            ra.HouseKeeperID = hk.HousekeeperID;
            ra.Content = ratingCreateDTO.Content;
            ra.Score = ratingCreateDTO.Score;
            ra.CreateAt = DateTime.Now;

            await _ratingService.AddRatingAsync(ra);

            var raL = await _ratingService.GetRatingsByHKAsync(hk.HousekeeperID);
            var totalRating = raL.Count;
            var totalScore = 0;

            foreach (var r in raL)
            {
                totalScore += r.Score;
            }

            var finalScore = (decimal)totalScore / totalRating;

            hk.Rating = Math.Round(finalScore, 1);
            hk.NumberOfRatings = totalRating;

            await _houseKeeperService.UpdateHousekeeperAsync(hk);

            var noti = new Notification();
            noti.AccountID = ratingCreateDTO.Reviewee;
            noti.RedirectUrl = "";
            noti.Message = fa.Account.Name + " đã đánh giá bạn " + ratingCreateDTO.Score + " sao!";

            await _notificationService.AddNotificationAsync(noti);
            Message = fa.Account.Nickname + " has rated " + hk.Account.Nickname + " !";

            return Ok(Message);
        }
    }
}