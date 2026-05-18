import prisma from '../src/config/prisma';

const medicamentosRENAME = [
  { nome_medicamento: 'Ácido acetilsalicílico 100mg', principio_ativo: 'Ácido acetilsalicílico', dosagem: '100mg', apresentacao: 'Comprimido', descricao: 'Antiagregante plaquetário - RENAME 2024' },
  { nome_medicamento: 'Ácido acetilsalicílico 500mg', principio_ativo: 'Ácido acetilsalicílico', dosagem: '500mg', apresentacao: 'Comprimido', descricao: 'Analgésico e antipirético - RENAME 2024' },
  { nome_medicamento: 'Ácido fólico 5mg', principio_ativo: 'Ácido fólico', dosagem: '5mg', apresentacao: 'Comprimido', descricao: 'Vitamina do complexo B - RENAME 2024' },
  { nome_medicamento: 'Albendazol 400mg', principio_ativo: 'Albendazol', dosagem: '400mg', apresentacao: 'Comprimido', descricao: 'Anti-helmíntico - RENAME 2024' },
  { nome_medicamento: 'Alopurinol 100mg', principio_ativo: 'Alopurinol', dosagem: '100mg', apresentacao: 'Comprimido', descricao: 'Antigotoso - RENAME 2024' },
  { nome_medicamento: 'Alopurinol 300mg', principio_ativo: 'Alopurinol', dosagem: '300mg', apresentacao: 'Comprimido', descricao: 'Antigotoso - RENAME 2024' },
  { nome_medicamento: 'Amiodarona 200mg', principio_ativo: 'Amiodarona', dosagem: '200mg', apresentacao: 'Comprimido', descricao: 'Antiarrítmico - RENAME 2024' },
  { nome_medicamento: 'Amitriptilina 25mg', principio_ativo: 'Amitriptilina', dosagem: '25mg', apresentacao: 'Comprimido', descricao: 'Antidepressivo tricíclico - RENAME 2024' },
  { nome_medicamento: 'Amoxicilina 250mg/5mL', principio_ativo: 'Amoxicilina', dosagem: '250mg/5mL', apresentacao: 'Suspensão oral', descricao: 'Antibiótico beta-lactâmico - RENAME 2024' },
  { nome_medicamento: 'Amoxicilina 500mg', principio_ativo: 'Amoxicilina', dosagem: '500mg', apresentacao: 'Cápsula', descricao: 'Antibiótico beta-lactâmico - RENAME 2024' },
  { nome_medicamento: 'Anlodipino 5mg', principio_ativo: 'Anlodipino', dosagem: '5mg', apresentacao: 'Comprimido', descricao: 'Bloqueador de canal de cálcio - RENAME 2024' },
  { nome_medicamento: 'Anlodipino 10mg', principio_ativo: 'Anlodipino', dosagem: '10mg', apresentacao: 'Comprimido', descricao: 'Bloqueador de canal de cálcio - RENAME 2024' },
  { nome_medicamento: 'Atenolol 25mg', principio_ativo: 'Atenolol', dosagem: '25mg', apresentacao: 'Comprimido', descricao: 'Beta-bloqueador - RENAME 2024' },
  { nome_medicamento: 'Atenolol 50mg', principio_ativo: 'Atenolol', dosagem: '50mg', apresentacao: 'Comprimido', descricao: 'Beta-bloqueador - RENAME 2024' },
  { nome_medicamento: 'Atenolol 100mg', principio_ativo: 'Atenolol', dosagem: '100mg', apresentacao: 'Comprimido', descricao: 'Beta-bloqueador - RENAME 2024' },
  { nome_medicamento: 'Azitromicina 500mg', principio_ativo: 'Azitromicina', dosagem: '500mg', apresentacao: 'Comprimido', descricao: 'Antibiótico macrolídeo - RENAME 2024' },
  { nome_medicamento: 'Benzilpenicilina benzatina 1.200.000UI', principio_ativo: 'Benzilpenicilina benzatina', dosagem: '1.200.000 UI', apresentacao: 'Pó para solução injetável', descricao: 'Antibiótico penicilínico - RENAME 2024' },
  { nome_medicamento: 'Bromoprida 10mg', principio_ativo: 'Bromoprida', dosagem: '10mg', apresentacao: 'Comprimido', descricao: 'Antiemético - RENAME 2024' },
  { nome_medicamento: 'Captopril 25mg', principio_ativo: 'Captopril', dosagem: '25mg', apresentacao: 'Comprimido', descricao: 'IECA anti-hipertensivo - RENAME 2024' },
  { nome_medicamento: 'Captopril 50mg', principio_ativo: 'Captopril', dosagem: '50mg', apresentacao: 'Comprimido', descricao: 'IECA anti-hipertensivo - RENAME 2024' },
  { nome_medicamento: 'Carbamazepina 200mg', principio_ativo: 'Carbamazepina', dosagem: '200mg', apresentacao: 'Comprimido', descricao: 'Anticonvulsivante - RENAME 2024' },
  { nome_medicamento: 'Cefalexina 500mg', principio_ativo: 'Cefalexina', dosagem: '500mg', apresentacao: 'Cápsula', descricao: 'Antibiótico cefalosporínico - RENAME 2024' },
  { nome_medicamento: 'Ciprofloxacino 500mg', principio_ativo: 'Ciprofloxacino', dosagem: '500mg', apresentacao: 'Comprimido', descricao: 'Antibiótico fluoroquinolônico - RENAME 2024' },
  { nome_medicamento: 'Claritromicina 500mg', principio_ativo: 'Claritromicina', dosagem: '500mg', apresentacao: 'Comprimido', descricao: 'Antibiótico macrolídeo - RENAME 2024' },
  { nome_medicamento: 'Clonazepam 0,5mg', principio_ativo: 'Clonazepam', dosagem: '0,5mg', apresentacao: 'Comprimido', descricao: 'Benzodiazepínico anticonvulsivante - RENAME 2024' },
  { nome_medicamento: 'Clonazepam 2mg', principio_ativo: 'Clonazepam', dosagem: '2mg', apresentacao: 'Comprimido', descricao: 'Benzodiazepínico anticonvulsivante - RENAME 2024' },
  { nome_medicamento: 'Clopidogrel 75mg', principio_ativo: 'Clopidogrel', dosagem: '75mg', apresentacao: 'Comprimido', descricao: 'Antiagregante plaquetário - RENAME 2024' },
  { nome_medicamento: 'Dexametasona 4mg', principio_ativo: 'Dexametasona', dosagem: '4mg', apresentacao: 'Comprimido', descricao: 'Corticosteroide - RENAME 2024' },
  { nome_medicamento: 'Diazepam 5mg', principio_ativo: 'Diazepam', dosagem: '5mg', apresentacao: 'Comprimido', descricao: 'Benzodiazepínico ansiolítico - RENAME 2024' },
  { nome_medicamento: 'Diazepam 10mg', principio_ativo: 'Diazepam', dosagem: '10mg', apresentacao: 'Comprimido', descricao: 'Benzodiazepínico ansiolítico - RENAME 2024' },
  { nome_medicamento: 'Digoxina 0,25mg', principio_ativo: 'Digoxina', dosagem: '0,25mg', apresentacao: 'Comprimido', descricao: 'Glicosídeo cardíaco - RENAME 2024' },
  { nome_medicamento: 'Dipirona sódica 500mg', principio_ativo: 'Dipirona sódica', dosagem: '500mg', apresentacao: 'Comprimido', descricao: 'Analgésico e antipirético - RENAME 2024' },
  { nome_medicamento: 'Dipirona sódica 500mg/mL', principio_ativo: 'Dipirona sódica', dosagem: '500mg/mL', apresentacao: 'Solução injetável', descricao: 'Analgésico e antipirético injetável - RENAME 2024' },
  { nome_medicamento: 'Doxiciclina 100mg', principio_ativo: 'Doxiciclina', dosagem: '100mg', apresentacao: 'Comprimido', descricao: 'Antibiótico tetraciclínico - RENAME 2024' },
  { nome_medicamento: 'Enalapril 5mg', principio_ativo: 'Enalapril', dosagem: '5mg', apresentacao: 'Comprimido', descricao: 'IECA anti-hipertensivo - RENAME 2024' },
  { nome_medicamento: 'Enalapril 10mg', principio_ativo: 'Enalapril', dosagem: '10mg', apresentacao: 'Comprimido', descricao: 'IECA anti-hipertensivo - RENAME 2024' },
  { nome_medicamento: 'Eritromicina 500mg', principio_ativo: 'Eritromicina', dosagem: '500mg', apresentacao: 'Comprimido', descricao: 'Antibiótico macrolídeo - RENAME 2024' },
  { nome_medicamento: 'Espironolactona 25mg', principio_ativo: 'Espironolactona', dosagem: '25mg', apresentacao: 'Comprimido', descricao: 'Diurético poupador de potássio - RENAME 2024' },
  { nome_medicamento: 'Etinilestradiol + Levonorgestrel 0,03/0,15mg', principio_ativo: 'Etinilestradiol + Levonorgestrel', dosagem: '0,03mg/0,15mg', apresentacao: 'Comprimido', descricao: 'Anticoncepcional oral combinado - RENAME 2024' },
  { nome_medicamento: 'Fenitoína 100mg', principio_ativo: 'Fenitoína', dosagem: '100mg', apresentacao: 'Comprimido', descricao: 'Anticonvulsivante - RENAME 2024' },
  { nome_medicamento: 'Fenobarbital 100mg', principio_ativo: 'Fenobarbital', dosagem: '100mg', apresentacao: 'Comprimido', descricao: 'Anticonvulsivante barbitúrico - RENAME 2024' },
  { nome_medicamento: 'Fluoxetina 20mg', principio_ativo: 'Fluoxetina', dosagem: '20mg', apresentacao: 'Cápsula', descricao: 'Antidepressivo ISRS - RENAME 2024' },
  { nome_medicamento: 'Furosemida 40mg', principio_ativo: 'Furosemida', dosagem: '40mg', apresentacao: 'Comprimido', descricao: 'Diurético de alça - RENAME 2024' },
  { nome_medicamento: 'Glibenclamida 5mg', principio_ativo: 'Glibenclamida', dosagem: '5mg', apresentacao: 'Comprimido', descricao: 'Antidiabético sulfonilureia - RENAME 2024' },
  { nome_medicamento: 'Haloperidol 1mg', principio_ativo: 'Haloperidol', dosagem: '1mg', apresentacao: 'Comprimido', descricao: 'Antipsicótico - RENAME 2024' },
  { nome_medicamento: 'Haloperidol 5mg', principio_ativo: 'Haloperidol', dosagem: '5mg', apresentacao: 'Comprimido', descricao: 'Antipsicótico - RENAME 2024' },
  { nome_medicamento: 'Hidroclorotiazida 25mg', principio_ativo: 'Hidroclorotiazida', dosagem: '25mg', apresentacao: 'Comprimido', descricao: 'Diurético tiazídico - RENAME 2024' },
  { nome_medicamento: 'Ibuprofeno 600mg', principio_ativo: 'Ibuprofeno', dosagem: '600mg', apresentacao: 'Comprimido', descricao: 'Anti-inflamatório não esteroidal - RENAME 2024' },
  { nome_medicamento: 'Insulina humana NPH 100UI/mL', principio_ativo: 'Insulina humana NPH', dosagem: '100 UI/mL', apresentacao: 'Solução injetável', descricao: 'Antidiabético insulínico - RENAME 2024' },
  { nome_medicamento: 'Insulina humana regular 100UI/mL', principio_ativo: 'Insulina humana regular', dosagem: '100 UI/mL', apresentacao: 'Solução injetável', descricao: 'Antidiabético insulínico - RENAME 2024' },
  { nome_medicamento: 'Isossorbida dinitrato 5mg', principio_ativo: 'Isossorbida dinitrato', dosagem: '5mg', apresentacao: 'Comprimido sublingual', descricao: 'Nitrato antianginoso - RENAME 2024' },
  { nome_medicamento: 'Ivermectina 6mg', principio_ativo: 'Ivermectina', dosagem: '6mg', apresentacao: 'Comprimido', descricao: 'Antiparasitário - RENAME 2024' },
  { nome_medicamento: 'Levodopa + Carbidopa 250/25mg', principio_ativo: 'Levodopa + Carbidopa', dosagem: '250mg/25mg', apresentacao: 'Comprimido', descricao: 'Antiparkinsoniano - RENAME 2024' },
  { nome_medicamento: 'Levotiroxina sódica 50mcg', principio_ativo: 'Levotiroxina sódica', dosagem: '50mcg', apresentacao: 'Comprimido', descricao: 'Hormônio tireoidiano - RENAME 2024' },
  { nome_medicamento: 'Levotiroxina sódica 100mcg', principio_ativo: 'Levotiroxina sódica', dosagem: '100mcg', apresentacao: 'Comprimido', descricao: 'Hormônio tireoidiano - RENAME 2024' },
  { nome_medicamento: 'Loperamida 2mg', principio_ativo: 'Loperamida', dosagem: '2mg', apresentacao: 'Cápsula', descricao: 'Antidiarreico - RENAME 2024' },
  { nome_medicamento: 'Losartana potássica 50mg', principio_ativo: 'Losartana potássica', dosagem: '50mg', apresentacao: 'Comprimido', descricao: 'BRA anti-hipertensivo - RENAME 2024' },
  { nome_medicamento: 'Losartana potássica 100mg', principio_ativo: 'Losartana potássica', dosagem: '100mg', apresentacao: 'Comprimido', descricao: 'BRA anti-hipertensivo - RENAME 2024' },
  { nome_medicamento: 'Metformina 500mg', principio_ativo: 'Metformina', dosagem: '500mg', apresentacao: 'Comprimido', descricao: 'Antidiabético biguanida - RENAME 2024' },
  { nome_medicamento: 'Metformina 850mg', principio_ativo: 'Metformina', dosagem: '850mg', apresentacao: 'Comprimido', descricao: 'Antidiabético biguanida - RENAME 2024' },
  { nome_medicamento: 'Metoclopramida 10mg', principio_ativo: 'Metoclopramida', dosagem: '10mg', apresentacao: 'Comprimido', descricao: 'Antiemético e procinético - RENAME 2024' },
  { nome_medicamento: 'Metoprolol 50mg', principio_ativo: 'Metoprolol', dosagem: '50mg', apresentacao: 'Comprimido', descricao: 'Beta-bloqueador seletivo - RENAME 2024' },
  { nome_medicamento: 'Metronidazol 250mg', principio_ativo: 'Metronidazol', dosagem: '250mg', apresentacao: 'Comprimido', descricao: 'Antiprotozoário e antibacteriano - RENAME 2024' },
  { nome_medicamento: 'Metronidazol 400mg', principio_ativo: 'Metronidazol', dosagem: '400mg', apresentacao: 'Comprimido', descricao: 'Antiprotozoário e antibacteriano - RENAME 2024' },
  { nome_medicamento: 'Mirtazapina 30mg', principio_ativo: 'Mirtazapina', dosagem: '30mg', apresentacao: 'Comprimido', descricao: 'Antidepressivo noradrenérgico - RENAME 2024' },
  { nome_medicamento: 'Nifedipino 10mg', principio_ativo: 'Nifedipino', dosagem: '10mg', apresentacao: 'Cápsula', descricao: 'Bloqueador de canal de cálcio - RENAME 2024' },
  { nome_medicamento: 'Nifedipino 20mg (liberação lenta)', principio_ativo: 'Nifedipino', dosagem: '20mg', apresentacao: 'Comprimido de liberação lenta', descricao: 'Bloqueador de canal de cálcio - RENAME 2024' },
  { nome_medicamento: 'Nitrofurantoína 100mg', principio_ativo: 'Nitrofurantoína', dosagem: '100mg', apresentacao: 'Cápsula', descricao: 'Antibacteriano urinário - RENAME 2024' },
  { nome_medicamento: 'Omeprazol 20mg', principio_ativo: 'Omeprazol', dosagem: '20mg', apresentacao: 'Cápsula', descricao: 'Inibidor de bomba de prótons - RENAME 2024' },
  { nome_medicamento: 'Omeprazol 40mg', principio_ativo: 'Omeprazol', dosagem: '40mg', apresentacao: 'Cápsula', descricao: 'Inibidor de bomba de prótons - RENAME 2024' },
  { nome_medicamento: 'Paracetamol 500mg', principio_ativo: 'Paracetamol', dosagem: '500mg', apresentacao: 'Comprimido', descricao: 'Analgésico e antipirético - RENAME 2024' },
  { nome_medicamento: 'Paracetamol 750mg', principio_ativo: 'Paracetamol', dosagem: '750mg', apresentacao: 'Comprimido', descricao: 'Analgésico e antipirético - RENAME 2024' },
  { nome_medicamento: 'Prednisolona 5mg', principio_ativo: 'Prednisolona', dosagem: '5mg', apresentacao: 'Comprimido', descricao: 'Corticosteroide - RENAME 2024' },
  { nome_medicamento: 'Prednisona 5mg', principio_ativo: 'Prednisona', dosagem: '5mg', apresentacao: 'Comprimido', descricao: 'Corticosteroide - RENAME 2024' },
  { nome_medicamento: 'Prednisona 20mg', principio_ativo: 'Prednisona', dosagem: '20mg', apresentacao: 'Comprimido', descricao: 'Corticosteroide - RENAME 2024' },
  { nome_medicamento: 'Propranolol 10mg', principio_ativo: 'Propranolol', dosagem: '10mg', apresentacao: 'Comprimido', descricao: 'Beta-bloqueador não seletivo - RENAME 2024' },
  { nome_medicamento: 'Propranolol 40mg', principio_ativo: 'Propranolol', dosagem: '40mg', apresentacao: 'Comprimido', descricao: 'Beta-bloqueador não seletivo - RENAME 2024' },
  { nome_medicamento: 'Ranitidina 150mg', principio_ativo: 'Ranitidina', dosagem: '150mg', apresentacao: 'Comprimido', descricao: 'Antagonista H2 - RENAME 2024' },
  { nome_medicamento: 'Risperidona 1mg', principio_ativo: 'Risperidona', dosagem: '1mg', apresentacao: 'Comprimido', descricao: 'Antipsicótico atípico - RENAME 2024' },
  { nome_medicamento: 'Risperidona 2mg', principio_ativo: 'Risperidona', dosagem: '2mg', apresentacao: 'Comprimido', descricao: 'Antipsicótico atípico - RENAME 2024' },
  { nome_medicamento: 'Salbutamol 100mcg/dose', principio_ativo: 'Salbutamol', dosagem: '100mcg/dose', apresentacao: 'Aerossol para inalação', descricao: 'Broncodilatador beta2-agonista - RENAME 2024' },
  { nome_medicamento: 'Sertralina 50mg', principio_ativo: 'Sertralina', dosagem: '50mg', apresentacao: 'Comprimido', descricao: 'Antidepressivo ISRS - RENAME 2024' },
  { nome_medicamento: 'Sertralina 100mg', principio_ativo: 'Sertralina', dosagem: '100mg', apresentacao: 'Comprimido', descricao: 'Antidepressivo ISRS - RENAME 2024' },
  { nome_medicamento: 'Sinvastatina 20mg', principio_ativo: 'Sinvastatina', dosagem: '20mg', apresentacao: 'Comprimido', descricao: 'Hipolipemiante estatina - RENAME 2024' },
  { nome_medicamento: 'Sinvastatina 40mg', principio_ativo: 'Sinvastatina', dosagem: '40mg', apresentacao: 'Comprimido', descricao: 'Hipolipemiante estatina - RENAME 2024' },
  { nome_medicamento: 'Sulfametoxazol + Trimetoprima 400/80mg', principio_ativo: 'Sulfametoxazol + Trimetoprima', dosagem: '400mg/80mg', apresentacao: 'Comprimido', descricao: 'Antibiótico sulfonamida - RENAME 2024' },
  { nome_medicamento: 'Sulfato ferroso 40mg', principio_ativo: 'Sulfato ferroso', dosagem: '40mg de Fe elementar', apresentacao: 'Comprimido', descricao: 'Suplemento de ferro - RENAME 2024' },
  { nome_medicamento: 'Tramadol 50mg', principio_ativo: 'Tramadol', dosagem: '50mg', apresentacao: 'Cápsula', descricao: 'Analgésico opioide fraco - RENAME 2024' },
  { nome_medicamento: 'Valproato de sódio 250mg', principio_ativo: 'Valproato de sódio', dosagem: '250mg', apresentacao: 'Comprimido', descricao: 'Anticonvulsivante e estabilizador de humor - RENAME 2024' },
  { nome_medicamento: 'Varfarina 5mg', principio_ativo: 'Varfarina', dosagem: '5mg', apresentacao: 'Comprimido', descricao: 'Anticoagulante oral - RENAME 2024' },
  { nome_medicamento: 'Verapamil 80mg', principio_ativo: 'Verapamil', dosagem: '80mg', apresentacao: 'Comprimido', descricao: 'Bloqueador de canal de cálcio - RENAME 2024' },
  { nome_medicamento: 'Vitamina D3 7.000UI', principio_ativo: 'Colecalciferol', dosagem: '7.000 UI', apresentacao: 'Comprimido', descricao: 'Suplemento vitamínico - RENAME 2024' },
  { nome_medicamento: 'Zolpidem 10mg', principio_ativo: 'Zolpidem', dosagem: '10mg', apresentacao: 'Comprimido', descricao: 'Hipnótico sedativo - RENAME 2024' },
];

async function main() {
  console.log('💊 Importando medicamentos da RENAME 2024...\n');

  let criados = 0;
  let pulados = 0;

  for (const med of medicamentosRENAME) {
    try {
      await prisma.medicamento.create({ data: med });
      criados++;
      console.log(`  ✅ ${med.nome_medicamento}`);
    } catch (e: any) {
      if (e.code === 'P2002') {
        pulados++;
        console.log(`  ⚠️  Já existe: ${med.nome_medicamento}`);
      } else {
        console.error(`  ❌ Erro em ${med.nome_medicamento}:`, e.message);
      }
    }
  }

  console.log(`\n✨ Concluído! Criados: ${criados} | Já existiam: ${pulados}`);
}

main()
  .catch((e) => {
    console.error('❌ Erro:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
