using Application.Interfaces.Persistence;
using Domain.Models;
using Infrastructure.Mappers;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence;

public class DraftImageRepository : IDraftImageRepository
{
    private readonly SimpleProductOrderServiceDbContext _dbContext;

    public DraftImageRepository(SimpleProductOrderServiceDbContext simpleProductOrderServiceDbContext)
    {
        _dbContext = simpleProductOrderServiceDbContext;
    }

    public async Task<DraftImage> CreateAsync(DraftImage draftImage)
    {
        var draftImageDbEntity = DraftImageMapper.ToDbModel(draftImage);
        _dbContext.DraftImage.Add(draftImageDbEntity);
        await _dbContext.SaveChangesAsync();
        return DraftImageMapper.ToDomain(draftImageDbEntity);
    }

    public async Task DeleteByFileNameAsync(string fileName)
    {
        var draftImageDbEntity = await _dbContext.DraftImage.SingleAsync(d => d.FileName == fileName);
        _dbContext.Remove(draftImageDbEntity);
        await _dbContext.SaveChangesAsync();
    }

    public async Task<DraftImage?> GetByFileNameAsync(string fileName)
    {
        var draftImageDbEntity = await _dbContext.DraftImage.SingleOrDefaultAsync(d => d.FileName == fileName);
        return draftImageDbEntity is null ? null : DraftImageMapper.ToDomain(draftImageDbEntity);
    }
}