#!/usr/bin/env python
"""Quick test - no prompts"""
import sys
sys.path.insert(0, '.')

print("Testing imports...")

try:
    from services.ai_engine.mock_ai_service import MockAIService
    print("✅ MockAIService")
except Exception as e:
    print(f"❌ MockAIService: {e}")
    sys.exit(1)

try:
    from services.ai_engine.ai_service_wrapper import AIService
    print("✅ AIService wrapper")
except Exception as e:
    print(f"❌ AIService wrapper: {e}")
    sys.exit(1)

try:
    from backend.integration.ai_adapter import AIAdapter
    print("✅ AIAdapter")
except Exception as e:
    print(f"❌ AIAdapter: {e}")
    sys.exit(1)

try:
    from backend.controller.pipeline_controller import PipelineController
    print("✅ PipelineController")
except Exception as e:
    print(f"❌ PipelineController: {e}")
    sys.exit(1)

print("\n🎉 All critical imports working!")
print("Backend should be operational now.")
