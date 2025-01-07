using Application.Errors;
using Domain.Models;
using OneOf;

namespace Application.Validators;

public class CanAddProductImageValidator : IValidator<CanAddProductImageValidator.Input, bool>
{
    private Product Product { get; }   

    public CanAddProductImageValidator(Product product)
    {
        Product = product;
    }

    public class Input
    {
        public Input(string fileName, string originalFileName, string url)
        {
            FileName = fileName;
            OriginalFileName = originalFileName;
            Url = url;
        }

        public string FileName { get; }
        public string OriginalFileName { get; }
        public string Url { get; }
    }

    public OneOf<bool, List<ApplicationError>> Validate(Input input)
    {
        var canAddProductImageResult = Product.CanAddProductImage(fileName: input.FileName, originalFileName: input.OriginalFileName, url: input.Url);
        
        if (canAddProductImageResult.TryPickT1(out var error, out var _))
        {
            return ApplicationErrorFactory.CreateSingleListError(
                message: error,
                path: [],
                code: ApplicationValidatorErrorCodes.CAN_ADD_PRODUCT_IMAGE
            );
        }

        return true;
    }
}