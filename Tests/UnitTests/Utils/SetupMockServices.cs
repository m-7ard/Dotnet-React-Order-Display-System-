using Application.Contracts.DomainService.OrderDomainService;
using Application.Errors;
using Application.Interfaces.Services;
using Application.Validators.DraftImageExistsValidator;
using Application.Validators.LatestProductHistoryExistsValidator;
using Application.Validators.OrderExistsValidator;
using Application.Validators.ProductExistsValidator;
using Domain.Models;
using Moq;
using OneOf;

namespace Tests.UnitTests.Utils;

public static class SetupMockServices
{
    public static void SetupLatestProductHistoryExistsValidatorSuccess<T>(Mock<ILatestProductHistoryExistsValidator<T>> mockValidator, T input, ProductHistory output)
    {
        mockValidator
            .Setup(validator => validator.Validate(It.Is<T>(id => Equals(id, input))))
            .ReturnsAsync(OneOf<ProductHistory, List<ApplicationError>>.FromT0(output));
    }

    public static void SetupLatestProductHistoryExistsValidatorFailure<T>(Mock<ILatestProductHistoryExistsValidator<T>> mockValidator)
    {
        mockValidator
            .Setup(validator => validator.Validate(It.IsAny<T>()))
            .ReturnsAsync(OneOf<ProductHistory, List<ApplicationError>>.FromT1([EmptyApplicationError.Instance]));
    }

    public static void SetupProductExistsValidatorSuccess<T>(Mock<IProductExistsValidator<T>> mockValidator, T input, Product output)
    {
        mockValidator
            .Setup(validator => validator.Validate(It.Is<T>(id => Equals(id, input))))
            .ReturnsAsync(OneOf<Product, List<ApplicationError>>.FromT0(output));
    }

    public static void SetupProductExistsValidatorFailure<T>(Mock<IProductExistsValidator<T>> mockValidator)
    {
        mockValidator
            .Setup(validator => validator.Validate(It.IsAny<T>()))
            .ReturnsAsync(OneOf<Product, List<ApplicationError>>.FromT1([EmptyApplicationError.Instance]));
    }

    public static void SetupOrderExistsValidatorSuccess<T>(Mock<IOrderExistsValidator<T>> mockValidator, T input, Order output)
    {
        mockValidator
            .Setup(validator => validator.Validate(It.Is<T>(id => Equals(id, input))))
            .ReturnsAsync(OneOf<Order, List<ApplicationError>>.FromT0(output));
    }

    public static void SetupOrderExistsValidatorFailure<T>(Mock<IOrderExistsValidator<T>> mockValidator)
    {
        mockValidator
            .Setup(validator => validator.Validate(It.IsAny<T>()))
            .ReturnsAsync(OneOf<Order, List<ApplicationError>>.FromT1([EmptyApplicationError.Instance]));
    }

    public static void SetupDraftImageExistsValidatorSuccess<T>(Mock<IDraftImageExistsValidator<T>> mockValidator, T input, DraftImage output)
    {
        mockValidator
            .Setup(validator => validator.Validate(It.Is<T>(id => Equals(id, input))))
            .ReturnsAsync(OneOf<DraftImage, List<ApplicationError>>.FromT0(output));
    }

    public static void SetupDraftImageExistsValidatorFailure<T>(Mock<IDraftImageExistsValidator<T>> mockValidator)
    {
        mockValidator
            .Setup(validator => validator.Validate(It.IsAny<T>()))
            .ReturnsAsync(OneOf<DraftImage, List<ApplicationError>>.FromT1([EmptyApplicationError.Instance]));
    }

    public static void SetupOrderDomainService_TryCreateNewOrder_Success(Mock<IOrderDomainService> mockValidator, Order output)
    {
        mockValidator
            .Setup(service => service.TryOrchestrateCreateNewOrder(It.IsAny<Guid>()))
            .ReturnsAsync(OneOf<Order, string>.FromT0(output));
    }

    public static void SetupOrderDomainService_TryCreateNewOrder_Failure(Mock<IOrderDomainService> mockValidator)
    {
        mockValidator
            .Setup(validator => validator.TryOrchestrateCreateNewOrder(It.IsAny<Guid>()))
            .ReturnsAsync(OneOf<Order, string>.FromT1(""));
    }

    public static void SetupOrderDomainService_TryOrchestrateAddNewOrderItem_Success(Mock<IOrderDomainService> mockValidator)
    {
        mockValidator
            .Setup(service => service.TryOrchestrateAddNewOrderItem(It.IsAny<OrchestrateAddNewOrderItemContract>()))
            .ReturnsAsync(OneOf<bool, string>.FromT0(true));
    }

    public static void SetupOrderDomainService_TryOrchestrateAddNewOrderItem_Failure(Mock<IOrderDomainService> mockValidator)
    {
        mockValidator
            .Setup(validator => validator.TryOrchestrateAddNewOrderItem(It.IsAny<OrchestrateAddNewOrderItemContract>()))
            .ReturnsAsync(OneOf<bool, string>.FromT1(""));
    }
}