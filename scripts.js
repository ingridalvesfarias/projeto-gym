const API_KEY = "";

document.getElementById('btnGerar').addEventListener('click', async () => {
    const peso = document.getElementById('peso').value;
    const altura = document.getElementById('altura').value;
    const objetivo = document.getElementById('objetivo').value;
    const resultadoDiv = document.getElementById('resultado');
    const msgDiv = document.getElementById('mensagemStatus');

    if (!peso || !altura) {
        alert("Por favor, preencha o peso e a altura.");
        return;
    }

    resultadoDiv.innerHTML = '<p class="loading-spinner">Gerando seu plano personalizado...</p>';
    msgDiv.innerText = ""; 

    const prompt = `Atue como personal trainer e nutricionista. Crie um plano para uma pessoa de ${peso}kg e ${altura}cm com objetivo de ${objetivo}. 
    Seja direto, use bullet points. Formato:
    ## 🏋️ Treino Sugerido
    (5 exercícios)
    ## 🍎 Sugestão de Dieta
    (Café, Almoço e Jantar)`;

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile", 
                messages: [{ role: "user", content: prompt }]
            })
        });

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error.message);
        }

        const textoResponse = data.choices[0].message.content;
        resultadoDiv.innerHTML = textoResponse.replace(/\n/g, '<br>');

    } catch (error) {
        console.error("Erro na API:", error);
        resultadoDiv.innerHTML = `<p style='color:red'>Erro ao gerar plano. Tente novamente mais tarde.</p>`;
    }
});

// Botão Limpar
document.getElementById('btnLimpar').addEventListener('click', () => {
    document.getElementById('peso').value = '';
    document.getElementById('altura').value = '';
    document.getElementById('resultado').innerHTML = '';
    document.getElementById('mensagemStatus').innerText = '';
});

// Botão Copiar
document.getElementById('btnCopiar').addEventListener('click', () => {
    const texto = document.getElementById('resultado').innerText;
    const msgDiv = document.getElementById('mensagemStatus');
    
    if (!texto) {
        msgDiv.innerText = "Nada para copiar!";
        msgDiv.style.color = "orange";
        return;
    }
    
    navigator.clipboard.writeText(texto).then(() => {
        msgDiv.innerText = "Plano copiado com sucesso!";
        msgDiv.style.color = "#00ff88"; 
        
        setTimeout(() => {
            msgDiv.innerText = "";
        }, 3000);
    });
});