# ia/views.py
import os
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

class ChatAIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        prompt = request.data.get("prompt")

        if not prompt:
            return Response({"error": "Prompt é obrigatório"}, status=400)

        try:
            completion = client.chat.completions.create(
                model="gpt-4o-mini",  # mais leve e rápido (recomendado)
                messages=[
                    {"role": "user", "content": prompt}
                ],
                max_tokens=300,
                temperature=0.7
            )

            answer = completion.choices[0].message.content

            return Response({"response": answer})

        except Exception as e:
            error_message = str(e)

            if "insufficient_quota" in error_message:
                return Response({
                    "response": "⚠️ O assistente IA está temporariamente indisponível. Tente novamente mais tarde."
                }, status=200)

            return Response({"error": error_message}, status=500)
        








