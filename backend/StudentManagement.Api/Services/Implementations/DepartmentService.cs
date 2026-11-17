
using StudentManagement.Api.DTOs;
using StudentManagement.Api.Models;
using StudentManagement.Api.Repositories.Interfaces;
using StudentManagement.Api.Services.Interfaces;

namespace StudentManagement.Api.Services.Implementations
{
    public class DepartmentService : IDepartmentService
    {
        private readonly IDepartmentRepository _repository;

        public DepartmentService(IDepartmentRepository repository)
        {
            _repository = repository;
        }

        // Convert Department Model to DTO
        private static DepartmentDto MapToDto(Department department)
        {
            return new DepartmentDto
            {
                Id = department.Id,
                Name = department.Name,
                Code = department.Code,
                Description = department.Description,
                CreatedAt = department.CreatedAt
            };
        }

        // Get all departments
        public async Task<List<DepartmentDto>> GetAllAsync()
        {
            var departments = await _repository.GetAllAsync();

            return departments.Select(MapToDto).ToList();
        }

        // Get department by ID
        public async Task<DepartmentDto?> GetByIdAsync(int id)
        {
            var department = await _repository.GetByIdAsync(id);

            return department == null ? null : MapToDto(department);
        }

        // Search departments by name or code
        public async Task<List<DepartmentDto>> SearchAsync(string keyword)
        {
            var departments = await _repository.GetAllAsync();

            if (string.IsNullOrWhiteSpace(keyword))
            {
                return departments.Select(MapToDto).ToList();
            }

            return departments
                .Where(d =>
                    d.Name.Contains(keyword, StringComparison.OrdinalIgnoreCase) ||
                    d.Code.Contains(keyword, StringComparison.OrdinalIgnoreCase))
                .Select(MapToDto)
                .ToList();
        }

        // Create department
        public async Task<DepartmentDto> CreateAsync(CreateDepartmentDto dto)
        {
            var code = dto.Code.Trim().ToUpperInvariant();

            var existing = await _repository.GetByCodeAsync(code);

            if (existing != null)
            {
                throw new InvalidOperationException(
                    "Department code already exists.");
            }

            var department = new Department
            {
                Name = dto.Name.Trim(),
                Code = code,
                Description = dto.Description?.Trim(),
                CreatedAt = DateTime.UtcNow
            };

            await _repository.AddAsync(department);

            return MapToDto(department);
        }

        // Update department
        public async Task<bool> UpdateAsync(int id, UpdateDepartmentDto dto)
        {
            var department = await _repository.GetByIdAsync(id);

            if (department == null)
            {
                return false;
            }

            var code = dto.Code.Trim().ToUpperInvariant();

            var existing = await _repository.GetByCodeAsync(code);

            if (existing != null && existing.Id != id)
            {
                throw new InvalidOperationException(
                    "Department code already exists.");
            }

            department.Name = dto.Name.Trim();
            department.Code = code;
            department.Description = dto.Description?.Trim();

            await _repository.UpdateAsync(department);

            return true;
        }

        // Delete department
        public async Task<bool> DeleteAsync(int id)
        {
            var department = await _repository.GetByIdAsync(id);

            if (department == null)
            {
                return false;
            }

            await _repository.DeleteAsync(department);

            return true;
        }
    }
}
