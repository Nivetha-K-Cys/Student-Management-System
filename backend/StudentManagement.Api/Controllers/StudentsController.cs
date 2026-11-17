
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudentManagement.Api.Data;
using StudentManagement.Api.DTOs;
using StudentManagement.Api.Models;

namespace StudentManagement.Api.Controllers
{
    [ApiController]
    [Route("api/students")]
    [Authorize(Roles = "Admin,Staff")]
    public class StudentsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public StudentsController(ApplicationDbContext context)
        {
            _context = context;
        }

        private static StudentResponseDto ToDto(Student s)
        {
            return new StudentResponseDto
            {
                Id = s.Id,
                Name = s.Name,
                Email = s.Email,
                RegisterNumber = s.RegisterNumber,
                Department = s.Department,
                Year = s.Year,
                PhoneNumber = s.PhoneNumber,
                CreatedAt = s.CreatedAt
            };
        }

        // GET: api/students
        [HttpGet]
        public async Task<ActionResult<List<StudentResponseDto>>> GetAll()
        {
            var students = await _context.Students
                .AsNoTracking()
                .OrderBy(s => s.Id)
                .ToListAsync();

            return Ok(students.Select(ToDto).ToList());
        }

        // GET: api/students/1
        [HttpGet("{id:int}")]
        public async Task<ActionResult<StudentResponseDto>> GetById(int id)
        {
            var student = await _context.Students.FindAsync(id);

            if (student == null)
                return NotFound(new { message = "Student not found" });

            return Ok(ToDto(student));
        }

        // POST: api/students
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<StudentResponseDto>> Create(
            [FromBody] StudentCreateDto dto)
        {
            var registerNumber = dto.RegisterNumber.Trim();
            var email = dto.Email.Trim();

            if (await _context.Students.AnyAsync(
                s => s.RegisterNumber == registerNumber))
            {
                return Conflict(new
                {
                    message = "Register number already exists"
                });
            }

            if (await _context.Students.AnyAsync(
                s => s.Email == email))
            {
                return Conflict(new
                {
                    message = "Email already exists"
                });
            }

            var student = new Student
            {
                Name = dto.Name.Trim(),
                Email = email,
                RegisterNumber = registerNumber,
                Department = dto.Department.Trim(),
                Year = dto.Year,
                PhoneNumber = dto.PhoneNumber.Trim(),
                CreatedAt = DateTime.UtcNow
            };

            _context.Students.Add(student);
            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetById),
                new { id = student.Id },
                ToDto(student));
        }

        // PUT: api/students/1
        [HttpPut("{id:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(
            int id,
            [FromBody] StudentUpdateDto dto)
        {
            var student = await _context.Students.FindAsync(id);

            if (student == null)
                return NotFound(new { message = "Student not found" });

            var registerNumber = dto.RegisterNumber.Trim();
            var email = dto.Email.Trim();

            bool duplicateRegister = await _context.Students.AnyAsync(
                s => s.Id != id && s.RegisterNumber == registerNumber);

            if (duplicateRegister)
                return Conflict(new
                {
                    message = "Register number already exists"
                });

            bool duplicateEmail = await _context.Students.AnyAsync(
                s => s.Id != id && s.Email == email);

            if (duplicateEmail)
                return Conflict(new
                {
                    message = "Email already exists"
                });

            student.Name = dto.Name.Trim();
            student.Email = email;
            student.RegisterNumber = registerNumber;
            student.Department = dto.Department.Trim();
            student.Year = dto.Year;
            student.PhoneNumber = dto.PhoneNumber.Trim();

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Student updated successfully",
                student = ToDto(student)
            });
        }

        // DELETE: api/students/1
        [HttpDelete("{id:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var student = await _context.Students.FindAsync(id);

            if (student == null)
                return NotFound(new { message = "Student not found" });

            _context.Students.Remove(student);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Student deleted successfully"
            });
        }

        // GET: api/students/search?keyword=Kavi
        [HttpGet("search")]
        public async Task<ActionResult<List<StudentResponseDto>>> Search(
            [FromQuery] string? keyword)
        {
            if (string.IsNullOrWhiteSpace(keyword))
                return await GetAll();

            var term = keyword.Trim();

            var students = await _context.Students
                .AsNoTracking()
                .Where(s =>
                    s.Name.Contains(term) ||
                    s.RegisterNumber.Contains(term) ||
                    s.Department.Contains(term) ||
                    s.Email.Contains(term))
                .OrderBy(s => s.Id)
                .ToListAsync();

            return Ok(students.Select(ToDto).ToList());
        }
    }
}
