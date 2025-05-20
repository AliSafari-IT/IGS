namespace IGSPharma.Application.DTOs
{
    public class ApiResponse<T>
    {
        public bool Success { get; set; }
        public string? Message { get; set; }
        public T? Data { get; set; }
    }

    public class PagedResponse<T> : ApiResponse<IEnumerable<T>>
    {
        public int Count { get; set; }
        public int Page { get; set; }
        public int TotalPages { get; set; }
    }
}
