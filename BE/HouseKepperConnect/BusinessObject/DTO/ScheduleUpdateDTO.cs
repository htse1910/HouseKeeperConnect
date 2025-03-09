using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObject.DTO
{
    public class ScheduleUpdateDTO
    {
        [Required]
        public int ScheduleID { get; set; }

        [Required]
        public int HousekeeperID { get; set; }

        [Required]
        public int SlotID { get; set; }

        [Required]
        public DateTime Date { get; set; }

        [Required]
        public int ScheduleTypeID { get; set; }

        [Required]
        public int Status
        {
            get; set;
        }
    }
}