using Application.Interfaces.Persistence;

namespace Infrastructure.Persistence;

public class UnitOfWork : IUnitOfWork
{
    private readonly SimpleProductOrderServiceDbContext _dbContext;

    public UnitOfWork(SimpleProductOrderServiceDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task SaveAsync()
    {
        await _dbContext.SaveChangesAsync();
    }
}
