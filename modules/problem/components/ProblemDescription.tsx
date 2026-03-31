import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { useUiProblmStore } from "../stores/problem-ui-store";

export function ProblemDescription() {
    const description = useUiProblmStore(s => s.description);
    const setDescription = useUiProblmStore(s => s.setDescription);
    const [localDescription, setLoaclDescription] = useState(description);
    const constraints = useUiProblmStore(s => s.constraints);
    const setConstraints = useUiProblmStore(s => s.setConstraints);
    const [locatConstraints, setLocalConstraints] = useState(constraints);
    
    useEffect(() => {
        const timer = setTimeout(() => {
            setDescription(localDescription);
        }, 500);
        return () => clearTimeout(timer);
    }, [localDescription, setDescription]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setConstraints(locatConstraints);
        }, 500);

        return () => clearTimeout(timer);
    }, [locatConstraints, setConstraints]);
    
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
                        value={localDescription}
                        onChange={(e) => setLoaclDescription(e.target.value)}
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
                        onChange={(e) => setLocalConstraints(e.target.value)}
                        rows={5}
                        required
                    />
                </div>
            </CardContent>
        </Card>
    );
}
