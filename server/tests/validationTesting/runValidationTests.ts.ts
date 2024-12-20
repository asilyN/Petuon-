
import { testNotNullConstraint } from "../test_not_null_constraint";
import { testUniqueConstraint } from "./test_unique_constraint";
import { testUuidGeneration } from "../test_uuid_generation";
import { testCascadingRules } from "./test_cascading_rules";
import { testForeignKeyIntegrity } from "../test_foreign_key_integrity";

async function runValidationTests() {
  console.log("Running validation tests...");
  
  await testNotNullConstraint();  
  await testUniqueConstraint();  
  await testUuidGeneration();     
  await testForeignKeyIntegrity();
  await testCascadingRules();

  console.log("All validation tests completed!");
}

runValidationTests().catch((error) => {
  console.error("Error running validation tests:", error);
});