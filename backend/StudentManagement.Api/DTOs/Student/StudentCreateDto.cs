
using System.ComponentModel.DataAnnotations;

namespace StudentManagement.Api.DTOs
{
    public class StudentCreateDto
    {
        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [MaxLength(150)]
        public string Email { get; set; } = string.Empty;

        [Required]
        [MaxLength(20)]
        public string RegisterNumber { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string Department { get; set; } = string.Empty;

        [Range(1, 4)]
        public int Year { get; set; }

        [MaxLength(20)]
        public string PhoneNumber { get; set; } = string.Empty;
    }
}
