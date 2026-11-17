
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StudentManagement.Api.DTOs;
using StudentManagement.Api.Services.Interfaces;

namespace StudentManagement.Api.Controllers
{
    [Route("api/departments")]
    [ApiController]
    [Authorize]
    public class DepartmentsController : ControllerBase
    {
        private readonly IDepartmentService _departmentService;

        public DepartmentsController(IDepartmentService departmentService)
        {
            _departmentService = departmentService;
        }

        // GET: api/departments
        // Admin and Staff
        [HttpGet]
        [Authorize(Roles = "Admin,Staff")]
        public async Task<IActionResult> GetAll()
        {
            var departments = await _departmentService.GetAllAsync();
            return Ok(departments);
        }

        // GET: api/departments/search?keyword=CSE
        // Admin and Staff
        [HttpGet("search")]
        [Authorize(Roles = "Admin,Staff")]
        public async Task<IActionResult> Search(
            [FromQuery] string keyword = "")
        {
            var departments = await _departmentService.SearchAsync(keyword);
            return Ok(departments);
        }

        // GET: api/departments/1
        // Admin and Staff
        [HttpGet("{id:int}")]
        [Authorize(Roles = "Admin,Staff")]
        public async Task<IActionResult> GetById(int id)
        {
            var department = await _departmentService.GetByIdAsync(id);

            if (department == null)
                return NotFound(new { message = "Department not found." });

            return Ok(department);
        }

        // POST: api/departments
        // Admin only
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create(
            [FromBody] CreateDepartmentDto dto)
        {
            try
            {
                var department = await _departmentService.CreateAsync(dto);

                return CreatedAtAction(
                    nameof(GetById),
                    new { id = department.Id },
                    department);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
        }

        // PUT: api/departments/1
        // Admin only
        [HttpPut("{id:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(
            int id,
            [FromBody] UpdateDepartmentDto dto)
        {
            try
            {
                var updated = await _departmentService.UpdateAsync(id, dto);

                if (!updated)
                    return NotFound(new { message = "Department not found." });

                return Ok(new { message = "Department updated successfully." });
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
        }

        // DELETE: api/departments/1
        // Admin only
        [HttpDelete("{id:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _departmentService.DeleteAsync(id);

            if (!deleted)
                return NotFound(new { message = "Department not found." });

            return Ok(new { message = "Department deleted successfully." });
        }
    }
}
