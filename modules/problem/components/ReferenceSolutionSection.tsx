import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function ReferenceSolutionSection() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Reference Solution</CardTitle>
                <CardDescription>
                    Add the official solution with explanation
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="referenceSolution">
                        Solution Code & Explanation *
                    </Label>
                    <Textarea
                        id="referenceSolution"
                        placeholder="## Approach&#10;Explain the approach...&#10;&#10;## Implementation&#10;```javascript&#10;function twoSum(nums, target) {&#10;    const map = new Map();&#10;    for (let i = 0; i < nums.length; i++) {&#10;        const complement = target - nums[i];&#10;        if (map.has(complement)) {&#10;            return [map.get(complement), i];&#10;        }&#10;        map.set(nums[i], i);&#10;    }&#10;}&#10;```&#10;&#10;## Complexity&#10;- Time: O(n)&#10;- Space: O(n)"
                        value={referenceSolution}
                        onChange={(e) =>
                            onReferenceSolutionChange(e.target.value)
                        }
                        rows={12}
                        className="font-mono text-sm"
                        required
                    />
                </div>
            </CardContent>
        </Card>
    );
}
