using Application.Errors;
using Application.Validators;
using Moq;
using OneOf;

namespace Tests.UnitTests.Utils;

public static class ValidatorMockHelper
{
public static void SetupAsyncValidate<TInput, TSuccess>(
    Mock<IValidatorAsync<TInput, TSuccess>> mockValidator,
    TInput input,
    TSuccess success
)
{
    mockValidator
        .Setup(v => v.Validate(It.Is<TInput>(i => EqualityComparer<TInput>.Default.Equals(i, input))))
        .ReturnsAsync(OneOf<TSuccess, List<ApplicationError>>.FromT0(success));
}
}
