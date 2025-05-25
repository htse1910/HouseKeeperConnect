using System.ComponentModel.DataAnnotations;

namespace BusinessObject.DTO
{
    public class ServiceCreateDTO
    {
        [Required]
        [StringLength(100, ErrorMessage = "Tên dịch vụ không qua 100 ký tự!")]
        public string ServiceName { get; set; }

        [Required]
        [Range(0, double.MaxValue, ErrorMessage = "Giá tiền phải lớn hơn hoặc bằng 0")]
        public decimal Price { get; set; }

        [Required]
        public int ServiceTypeID { get; set; }

        [StringLength(255, ErrorMessage = "Mô tả không thế qua 255 ký tự!")]
        public string? Description { get; set; }
    }
}