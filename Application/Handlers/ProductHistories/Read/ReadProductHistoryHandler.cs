using Application.Errors;
using Application.Interfaces.Persistence;
using MediatR;
using OneOf;

namespace Application.Handlers.ProductHistories.Read;

public class ReadProductHistoryHandler : IRequestHandler<ReadProductHistoryQuery, OneOf<ReadProductHistoryResult, List<ApplicationError>>>
{
    private readonly IProductHistoryRepository _productHistoryRepository;

    public ReadProductHistoryHandler(IProductHistoryRepository productHistoryRepository)
    {
        _productHistoryRepository = productHistoryRepository;
    }

    public async Task<OneOf<ReadProductHistoryResult, List<ApplicationError>>> Handle(ReadProductHistoryQuery request, CancellationToken cancellationToken)
    {
        var productHistory = await _productHistoryRepository.GetByIdAsync(request.Id);
        if (productHistory is null)
        {
            return new List<ApplicationError>() {
                new ApplicationError(
                    message: $"ProductHistory with Id \"{request.Id}\" does not exist.",
                    path: ["_"],
                    code: ApplicationErrorCodes.ModelDoesNotExist
                )
            };
        }

        var result = new ReadProductHistoryResult(productHistory: productHistory);
        return result;
    }
}