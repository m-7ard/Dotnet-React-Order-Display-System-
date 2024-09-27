using Application.ApiModels;

namespace Application.Api.ProductHistories.List.DTOs;

public class ListProductHistoriesResponseDTO
{
    public ListProductHistoriesResponseDTO(List<ProductHistoryApiModel> productHistories)
    {
        ProductHistories = productHistories;
    }

    public List<ProductHistoryApiModel> ProductHistories { get; set; }
}