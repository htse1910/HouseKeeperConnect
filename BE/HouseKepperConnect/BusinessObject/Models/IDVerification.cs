using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BusinessObject.Models
{
    public class IDVerification
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int VerifyID { get; set; }

        public int IDNumber { get; set; }
        public string RealName { get; set; }
        public DateTime DateOfBirth { get; set; }

        [Required]
        public byte[] FrontPhoto { get; set; }

        [Required]
        public byte[] BackPhoto { get; set; }

        [Required]
        public byte[] FacePhoto { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        [Required]
        public int Status { get; set; }
    }
}