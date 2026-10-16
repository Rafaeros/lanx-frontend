import * as React from "react";
import { useParams, useNavigate } from "react-router";
import { useMaterialQuery, useUpdateMaterialMutation } from "../api/use-materiais";
import { MaterialForm } from "../components/material-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import type { MaterialFormData } from "../schemas";

export function MaterialEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: material, isLoading } = useMaterialQuery(id ?? null);
  const updateMutation = useUpdateMaterialMutation();

  const handleSubmit = (data: MaterialFormData) => {
    if (id) {
      updateMutation.mutate(
        { id, data },
        {
          onSuccess: () => {
            navigate("/cadastros/materiais");
          },
        }
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/cadastros/materiais")}
          className="gap-1.5"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Voltar para Lista</span>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Editar Material</CardTitle>
          <CardDescription>
            Alteração das propriedades cadastrais do material {material?.codigo}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MaterialForm
            initialData={material}
            onSubmit={handleSubmit}
            onCancel={() => navigate("/cadastros/materiais")}
            isLoading={updateMutation.isPending}
          />
        </CardContent>
      </Card>
    </div>
  );
}

