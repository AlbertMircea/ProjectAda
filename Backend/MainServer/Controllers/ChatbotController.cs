using System.Text;
using Azure;
using Azure.AI.Inference;
using DotnetAPI.Dtos;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class ChatbotController : ControllerBase
{
    private readonly ChatCompletionsClient _chatClient;

    public ChatbotController(IConfiguration configuration)
    {
        var endpoint = new Uri("https://bearacz-resource.services.ai.azure.com/models");
        var credential = new AzureKeyCredential(configuration["AzureAI:Key"]);
        _chatClient = new ChatCompletionsClient(
            endpoint,
            credential,
            new AzureAIInferenceClientOptions(AzureAIInferenceClientOptions.ServiceVersion.V2024_05_01_Preview)
        );
    }

    [HttpPost("ask")]
    public async Task<IActionResult> Ask([FromBody] ChatRequest request)
    {
        var options = new ChatCompletionsOptions
        {
            Messages = { new ChatRequestUserMessage(request.Message) },
            MaxTokens = 2048,
            Model = "DeepSeek-R1"
        };

        var response = await _chatClient.CompleteStreamingAsync(options);

        var fullReply = new StringBuilder();
        await foreach (var update in response)
        {
            if (!string.IsNullOrEmpty(update.ContentUpdate))
            {
                fullReply.Append(update.ContentUpdate);
            }
        }

        return Ok(new { reply = fullReply.ToString() });
    }

    [HttpGet("stream")]
    public async Task StreamChat([FromQuery] string message)
    {
        Response.Headers.Append("Content-Type", "text/event-stream");
        Response.Headers.Append("Cache-Control", "no-cache");
        Response.Headers.Append("X-Accel-Buffering", "no");

        var bufferingFeature = HttpContext.Features.Get<Microsoft.AspNetCore.Http.Features.IHttpResponseBodyFeature>();
        bufferingFeature?.DisableBuffering();

        var requestOptions = new ChatCompletionsOptions
        {
            Messages = { new ChatRequestUserMessage(message) },
            MaxTokens = 2048,
            Model = "DeepSeek-R1"
        };

        var response = await _chatClient.CompleteStreamingAsync(requestOptions);
        await foreach (var update in response)
        {
            if (!string.IsNullOrEmpty(update.ContentUpdate))
            {
                var data = $"data: {update.ContentUpdate}\n\n";
                var bytes = Encoding.UTF8.GetBytes(data);
                await Response.Body.WriteAsync(bytes);
                await Response.Body.FlushAsync();
            }
        }

        var done = "data: [DONE]\n\n";
        await Response.Body.WriteAsync(Encoding.UTF8.GetBytes(done));
        await Response.Body.FlushAsync();
    }

    [HttpGet("stream-test")]
    public async Task StreamTest()
    {
        Response.Headers.Append("Content-Type", "text/event-stream");
        Response.Headers.Append("Cache-Control", "no-cache");
        Response.Headers.Append("X-Accel-Buffering", "no");

        var bufferingFeature = HttpContext.Features.Get<Microsoft.AspNetCore.Http.Features.IHttpResponseBodyFeature>();
        bufferingFeature?.DisableBuffering();

        for (int i = 0; i < 10; i++)
        {
            var data = $"data: Message {i}\n\n";
            var bytes = Encoding.UTF8.GetBytes(data);
            await Response.Body.WriteAsync(bytes);
            await Response.Body.FlushAsync();
            await Task.Delay(1000); // 1 second delay to simulate streaming
        }

        await Response.Body.WriteAsync(Encoding.UTF8.GetBytes("data: [DONE]\n\n"));
        await Response.Body.FlushAsync();
    }
}
