"""
Comprehensive import test and fix verification
"""

import sys
import traceback

def test_import(module_path, class_name=None):
    """Test if a module/class can be imported"""
    try:
        if class_name:
            exec(f"from {module_path} import {class_name}")
            print(f"✅ {module_path}.{class_name}")
            return True
        else:
            exec(f"import {module_path}")
            print(f"✅ {module_path}")
            return True
    except Exception as e:
        print(f"❌ {module_path}.{class_name if class_name else ''}: {e}")
        return False

print("=" * 60)
print("Testing All Critical Imports")
print("=" * 60)

results = []

# Test AI Engine imports
print("\n📦 AI Engine:")
results.append(test_import("services.ai_engine.mock_ai_service", "MockAIService"))
results.append(test_import("services.ai_engine.enhanced_bias_detector", "EnhancedBiasDetector"))
results.append(test_import("services.ai_engine.language_service", "LanguageDetectionService"))
results.append(test_import("services.ai_engine.ai_service_wrapper", "AIService"))

# Test Fairness Engine imports
print("\n⚖️  Fairness Engine:")
results.append(test_import("services.fairness_engine.fairness_engine", "FairnessEngine"))
results.append(test_import("services.fairness_engine.risk_engine", "calculate_risk"))

# Test Storage imports
print("\n💾 Storage:")
results.append(test_import("services.storage.local_storage", "LocalStorageService"))

# Test Backend imports
print("\n🔧 Backend:")
results.append(test_import("backend.integration.ai_adapter", "AIAdapter"))
results.append(test_import("backend.integration.fairness_adapter", "FairnessAdapter"))
results.append(test_import("backend.integration.storage_adapter", "StorageAdapter"))
results.append(test_import("backend.controller.pipeline_controller", "PipelineController"))

# Test Schemas
print("\n📋 Schemas:")
results.append(test_import("schemas.ai_schema", "AIAnalysisResult"))
results.append(test_import("schemas.fairness_schema", "FairnessResult"))
results.append(test_import("schemas.request_schema", "AnalyzeRequest"))
results.append(test_import("schemas.response_schema", "AnalyzeResponse"))

# Summary
print("\n" + "=" * 60)
print("Summary")
print("=" * 60)
passed = sum(results)
total = len(results)
print(f"Passed: {passed}/{total}")

if passed == total:
    print("\n🎉 All imports working! Backend should be operational.")
else:
    print(f"\n⚠️  {total - passed} imports failed. Fixing needed.")

sys.exit(0 if passed == total else 1)
