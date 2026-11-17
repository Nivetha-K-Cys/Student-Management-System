
using StudentManagement.Api.DTOs;

namespace StudentManagement.Api.Services.Interfaces
{
    public interface IDepartmentService
    {
        // Get all departments
        Task<List<DepartmentDto>> GetAllAsync();

        // Get department by ID
        Task<DepartmentDto?> GetByIdAsync(int id);

        // Search departments
        Task<List<DepartmentDto>> SearchAsync(string keyword);

        // Add department
        Task<DepartmentDto> CreateAsync(CreateDepartmentDto dto);

        // Update department
        Task<bool> UpdateAsync(int id, UpdateDepartmentDto dto);

        // Delete department
        Task<bool> DeleteAsync(int id);
    }
}
