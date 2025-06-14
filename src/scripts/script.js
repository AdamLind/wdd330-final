const generateBtn = document.getElementById("generateBtn");
const seedOutput = document.getElementById("seedOutput");
const output = document.getElementById("promptOutput");

generateBtn.addEventListener("click", async () => {
  output.textContent = "Thinking...";

  try {
    // Step 1: Get random word
    const wordSeed = await fetch(
      "https://random-word-api.herokuapp.com/word?number=1"
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("Random word:", data[0]);
        seedOutput.textContent = data[0];
        const response = data[0];
        return response;
      })
      .catch((error) => {
        console.error("Error fetching random word:", error);
      });

    // Step 2: Use Cohere API to generate a writing prompt
    const cohereResponse = await fetch("https://api.cohere.ai/v1/generate", {
      method: "POST",
      headers: {
        Authorization: "Bearer bj1sIpeboHcgkW6gZRhUo8U0nWLilR7ZS7H7zaC5",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "command",
        prompt: `Generate a JSON object describing a creative writing prompt. Use the word "${wordSeed}" and follow this format:
        {
          "title": "...",
          "setting": "...",
          "point_of_view": "...",
          "genre": "...",
          "tone": "...",
          "first_line": "...",
          "summary": "...",
          "keywords": ["...", "..."]
        }
        Do not include any additional text or explanations. Each field should be concise to one short sentence. Response should not exceed 100 tokens.`,

        max_tokens: 200,
        temperature: 0.9,
      }),
    });

    const cohereData = await cohereResponse.json();
    try {
      const parsed = await JSON.parse(cohereData.generations[0].text.trim());
      console.log("Parsed JSON:", parsed);

      // Update each element by ID
      document.getElementById("title").textContent = parsed.title || "N/A";
      document.getElementById("setting").textContent = parsed.setting || "N/A";
      document.getElementById("point_of_view").textContent =
        parsed.point_of_view || "N/A";
      document.getElementById("genre").textContent = parsed.genre || "N/A";
      document.getElementById("tone").textContent = parsed.tone || "N/A";
      document.getElementById("first_line").textContent =
        parsed.first_line || "N/A";
      document.getElementById("summary").textContent = parsed.summary || "N/A";
      document.getElementById("keywords").textContent =
        (parsed.keywords && parsed.keywords.join(", ")) || "N/A";
    } catch (e) {
      console.error("Error parsing JSON:", e);
      output.textContent = "Oops! AI returned invalid JSON.";
    }

    if (cohereData.generations && cohereData.generations.length > 0) {
      output.textContent = cohereData.generations[0].text.trim();
    } else {
      output.textContent = "No prompt generated.";
    }
  } catch (error) {
    console.error("Error:", error);
    output.textContent = "Failed to generate prompt.";
  }
});
