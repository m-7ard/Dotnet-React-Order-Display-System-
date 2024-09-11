using Application.ErrorHandling.Application;
using Application.ErrorHandling.Other;
using Application.Interfaces.Persistence;
using Domain.DomainFactories;
using MediatR;
using OneOf;

namespace Application.Api.Products.Create.Handlers;

public class CreateProductHandler : IRequestHandler<CreateProductCommand, OneOf<CreateProductResult, List<PlainApplicationError>>>
{
    private readonly IProductRepository _productRepository;
    private readonly IProductImageRepository _productImageRepository;
    private readonly IProductHistoryRepository _productHistoryRepository;

    public CreateProductHandler(IProductRepository productRespository, IProductImageRepository productImageRespository, IProductHistoryRepository productHistoryRepository)
    {
        _productRepository = productRespository;
        _productImageRepository = productImageRespository;
        _productHistoryRepository = productHistoryRepository;
    }

    public async Task<OneOf<CreateProductResult, List<PlainApplicationError>>> Handle(CreateProductCommand request, CancellationToken cancellationToken)
    {
        var errors = new List<PlainApplicationError>();
        var inputProduct = ProductFactory.BuildNewProduct(
            name: request.Name,
            price: request.Price,
            description: request.Description,
            images: []
        );

        foreach (var fileName in request.Images)
        {
            var productImage = await _productImageRepository.GetByFileNameAsync(fileName);
            if (productImage is null)
            {
                errors.Add(new PlainApplicationError(
                    message: $"ProductImage of fileName \"{fileName}\" does not exist.",
                    path: ["images", fileName],
                    code: ValidationErrorCodes.ModelDoesNotExist
                ));
                continue;
            }

            if (productImage.ProductId is not null)
            {
                errors.Add(new PlainApplicationError(
                    message:  $"MenuItemImage of fileName \"{fileName}\" has already been assigned to another Product.",
                    path: ["images", fileName],
                    code: ValidationErrorCodes.StateMismatch
                ));
                continue;
            }
            
            inputProduct.Images.Add(productImage);
        }

        if (errors.Count > 0)
        {
            return errors;
        }


        var error = new List<PlainApplicationError>();
        if (error.Count > 0)
        {
            return error;
        }

        var outputProduct = await _productRepository.CreateAsync(inputProduct);
        foreach (var productImage in inputProduct.Images)
        {
            var outputproductImage = await _productImageRepository.AssignToProduct(productId: outputProduct.Id, productImageId: productImage.Id);
            outputProduct.Images.Add(outputproductImage);
        }
        
        var inputProductHistory = ProductHistoryFactory.BuildNewProductHistory(
            name: outputProduct.Name,
            images: outputProduct.Images.Select(image => image.FileName).ToList(),
            price: outputProduct.Price,
            productId: outputProduct.Id,
            description: outputProduct.Description
        );
        var productHistory = await _productHistoryRepository.CreateAsync(inputProductHistory);

        return new CreateProductResult
        (
            product: outputProduct
        );
    }
}