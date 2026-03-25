import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ProblemDescriptionProps } from "@/types";

export function ProblemDescription({
    description,
    constraints,
    onDescriptionChange,
    onConstraintsChange,
}: ProblemDescriptionProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Problem Description</CardTitle>
                <CardDescription>
                    Provide detailed problem description and constraints
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                        id="description"
                        placeholder="Describe the problem in detail..."
                        value={description}
                        onChange={(e) => onDescriptionChange(e.target.value)}
                        rows={8}
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="constraints">Constraints *</Label>
                    <Textarea
                        id="constraints"
                        placeholder="• 2 ≤ nums.length ≤ 10⁴&#10;• -10⁹ ≤ nums[i] ≤ 10⁹&#10;• -10⁹ ≤ target ≤ 10⁹"
                        value={constraints}
                        onChange={(e) => onConstraintsChange(e.target.value)}
                        rows={5}
                        required
                    />
                </div>
            </CardContent>
        </Card>
    );
}
