[中文版本 →](../../../zh/projects/project-03-multi-session-continuity/)

> İlgili dersler: [Ders 05. Bağlamı oturumlar boyunca canlı tutun](./../../lectures/lecture-05-why-long-running-tasks-lose-continuity/index.md) · [Ders 06. Her ajan oturumundan önce başlatma yapın](./../../lectures/lecture-06-why-initialization-needs-its-own-phase/index.md)
> Şablon dosyaları: [templates/](https://github.com/walkinglabs/learn-harness-engineering/blob/main/docs/en/resources/templates/)

# Proje 03. Ajanı oturum yeniden başlatmaları boyunca çalışır tutun

## Ne Yapacaksınız

Ajana kapsam kontrolü ve doğrulama eşikleri ekleyin. Doküman parçalama, üst veri çıkarımı, dizinleme ilerleme göstergesi ve alıntı tabanlı Soru-Cevap akışını uygulayın. Özellik durumunu izlemek için `feature_list.json` kullanın — aynı anda tek özellik, doğrulama kanıtı olmadan "geçti" işaretlemesi yok.

İki kez çalıştırın: ilk seferinde kısıt olmadan, ikinci seferinde katı uygulamayla.

## Araçlar

- Claude Code veya Codex
- Git
- Node.js + Electron

## Harness Mekanizması

İlerleme günlüğü + oturum devri + çok oturumlu süreklilik
