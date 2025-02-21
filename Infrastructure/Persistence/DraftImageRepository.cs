using Application.Interfaces.Persistence;
using Domain.Models;
using Domain.ValueObjects.Shared;
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

    public async Task DeleteByFileNameAsync(FileName fileName)
    {
        await LazyDeleteByFileNameAsync(fileName);
        await _dbContext.SaveChangesAsync();
    }

    public async Task LazyDeleteByFileNameAsync(FileName fileName)
    {
        var draftImageDbEntity = await _dbContext.DraftImage.SingleAsync(d => d.FileName == fileName.Value);
        _dbContext.Remove(draftImageDbEntity);
    }

    public async Task<DraftImage?> GetByFileNameAsync(FileName fileName)
    {
        var draftImages = await _dbContext.DraftImage.ToListAsync();
        var draftImageDbEntity = await _dbContext.DraftImage.SingleOrDefaultAsync(d => d.FileName == fileName.Value);
        return draftImageDbEntity is null ? null : DraftImageMapper.ToDomain(draftImageDbEntity);
    }
}