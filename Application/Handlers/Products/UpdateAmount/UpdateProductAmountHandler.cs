using Application.Errors;
using Application.Errors.Objects;
using Application.Interfaces.Persistence;
using Application.Validators.ProductExistsValidator;
using Domain.Contracts.Products;
using Domain.ValueObjects.Product;
using MediatR;
using OneOf;

namespace Application.Handlers.Products.UpdateAmount;

public class UpdateProductAmountHandler : IRequestHandler<UpdateProductAmountCommand, OneOf<UpdateProductAmountResult, List<ApplicationError>>>
{
    private readonly IProductRepository _productRepository;
    private readonly IProductExistsValidator<ProductId> _productExistsValidator;

    public UpdateProductAmountHandler(IProductRepository productRepository, IProductExistsValidator<ProductId> productExistsValidator)
    {
        _productRepository = productRepository;
        _productExistsValidator = productExistsValidator;
    }

    public async Task<OneOf<UpdateProductAmountResult, List<ApplicationError>>> Handle(UpdateProductAmountCommand request, CancellationToken cancellationToken)
    {
        var canCreateProductId = ProductId.CanCreate(request.Id);
        if (canCreateProductId.TryPickT1(out var error, out var _))
        {
            return new OperationFailedError(message: error, path: []).AsList();
        }

        var productId = ProductId.ExecuteCreate(request.Id);
        var productExistsResult = await _productExistsValidator.Validate(productId);
        if (productExistsResult.TryPickT1(out var errors, out var product))
        {
            return errors;
        }

        // Update properties
        var contract = new UpdateProductContract(
            id: product.Id.Value,
            name: product.Name,
            price: product.Price.Value,
            description: product.Description,
            amount: request.Amount
        );

        var canUpdate = product.CanUpdate(contract);
        if (canUpdate.TryPickT1(out error, out _))
        {
            return new CannotUpdateProductError(message: error, path: []).AsList();
        }

        product.ExecuteUpdate(contract);
        await _productRepository.UpdateAsync(product);

        return new UpdateProductAmountResult();
    }
}