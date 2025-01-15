namespace Application.Errors;

public static class ApplicationValidatorErrorCodes
{
    public const string ORDER_EXISTS_ERROR = "ORDER_EXISTS_ERROR";
    public const string ORDER_ITEM_EXISTS_ERROR = "ORDER_ITEM_EXISTS_ERROR";
    public const string PRODUCT_EXISTS_ERROR = "PRODUCT_EXISTS_ERROR";
    public const string LATEST_PRODUCT_HISTORY_EXISTS_ERROR = "LATEST_PRODUCT_HISTORY_EXISTS_ERROR";
    public const string PRODUCT_HISTORY_EXISTS_ERROR = "PRODUCT_HISTORY_EXISTS_ERROR";
    public const string DRAFT_IMAGE_EXISTS_ERROR = "DRAFT_IMAGE_EXISTS_ERROR";
    public const string CAN_ADD_ORDER_ITEM_ERROR = "CAN_ADD_ORDER_ITEM_ERROR";
    public const string CAN_ADD_PRODUCT_IMAGE = "CAN_ADD_PRODUCT_IMAGE";
}