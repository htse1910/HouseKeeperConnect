using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BusinessObject.DTOs
{
    public class JobCreateDTO
    {
        [Required]
        public int AccountID { get; set; }

        [Required]
        [StringLength(100)]
        public string JobName { get; set; }

        [Required]
        public int Status { get; set; }

        public List<JobDetailCreateDTO> JobDetails { get; set; }
    }

    public class JobDetailCreateDTO
    {
        [Required]
        public string Frequency { get; set; }

        [Required]
        public string Location { get; set; }

        [Required]
        public int ServiceID { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime EndDate { get; set; }

        public string Description { get; set; }

        [Required]
        public int StartSlot { get; set; }

        [Required]
        public int EndSlot { get; set; }
    }
}
